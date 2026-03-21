import { createPartFromUri, GoogleGenAI } from '@google/genai'
import type { AnalysisResults } from '~~/types/results'

const analysisResultsSchema = {
  type: 'object',
  properties: {
    overallScore: {
      type: 'number',
      description: 'Overall CV quality score from 0 to 100.',
    },
    executiveSummary: {
      type: 'string',
      description: 'A concise summary of the candidate profile and fit.',
    },
    readability: {
      type: 'number',
      description: 'Readability score from 0 to 100.',
    },
    keywordMatch: {
      type: 'number',
      description: 'Keyword relevance score from 0 to 100.',
    },
    impactScore: {
      type: 'number',
      description: 'Impact and achievement clarity score from 0 to 100.',
    },
    keyStrengths: {
      type: 'array',
      description: 'Top strengths found in the CV.',
      items: {
        type: 'string',
      },
    },
    growthOpportunities: {
      type: 'array',
      description: 'Top areas to improve in the CV.',
      items: {
        type: 'string',
      },
    },
  },
  required: [
    'overallScore',
    'executiveSummary',
    'readability',
    'keywordMatch',
    'impactScore',
    'keyStrengths',
    'growthOpportunities',
  ],
} as const

const normalizeScore = (value: unknown) => {
  const numericValue = typeof value === 'number' ? value : Number(value)

  if (Number.isNaN(numericValue)) {
    return 0
  }

  return Math.min(100, Math.max(0, Math.round(numericValue)))
}

const normalizeResults = (value: unknown): AnalysisResults => {
  const result = (value && typeof value === 'object') ? value as Record<string, unknown> : {}

  return {
    overallScore: normalizeScore(result.overallScore),
    executiveSummary: typeof result.executiveSummary === 'string' ? result.executiveSummary : '',
    readability: normalizeScore(result.readability),
    keywordMatch: normalizeScore(result.keywordMatch),
    impactScore: normalizeScore(result.impactScore),
    keyStrengths: Array.isArray(result.keyStrengths) ? result.keyStrengths.filter(item => typeof item === 'string') : [],
    growthOpportunities: Array.isArray(result.growthOpportunities) ? result.growthOpportunities.filter(item => typeof item === 'string') : [],
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const files = await readMultipartFormData(event)
  const uploadedFile = files?.find(file => file.name === 'cv')

  if (!uploadedFile?.data?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A CV file is required.',
    })
  }

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_GEMINI_API is not configured.',
    })
  }

  const mimeType = uploadedFile.type || 'application/pdf'
  if (mimeType !== 'application/pdf') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only PDF CV files are supported.',
    })
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey })
  const fileBytes = new Uint8Array(uploadedFile.data)
  const fileBlob = new Blob([fileBytes], { type: mimeType })
  const geminiFile = await ai.files.upload({
    file: fileBlob,
    config: {
      mimeType,
      displayName: uploadedFile.filename || 'cv.pdf',
    },
  })

  let processedFile = geminiFile
  while (processedFile.state === 'PROCESSING') {
    await new Promise(resolve => setTimeout(resolve, 1000))
    processedFile = await ai.files.get({ name: processedFile.name! })
  }

  if (processedFile.state === 'FAILED' || !processedFile.uri || !processedFile.mimeType) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Gemini could not process the uploaded PDF.',
    })
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      [
        'Analyze this CV and return only structured JSON.',
        'Score values must be integers from 0 to 100.',
        'Provide 3 to 5 concise items for keyStrengths and growthOpportunities.',
        'The executiveSummary should be 2 or 3 sentences.',
      ].join(' '),
      createPartFromUri(processedFile.uri, processedFile.mimeType),
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: analysisResultsSchema,
    },
  })

  if (processedFile.name) {
    await ai.files.delete({ name: processedFile.name }).catch(() => {})
  }

  return normalizeResults(JSON.parse(response.text || '{}'))
})
