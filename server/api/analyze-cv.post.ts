import { createPartFromUri, GoogleGenAI } from '@google/genai'
import type { AnalysisResults } from '~~/types/results'

const analysisResultsSchema = {
  type: 'object',
  properties: {
    candidate: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        current_title: { type: 'string' },
        location: { type: 'string' },
        experience_years: { type: 'number' },
        availability: { type: 'string' },
      },
      required: ['name', 'current_title', 'location', 'experience_years', 'availability'],
    },
    match: {
      type: 'object',
      properties: {
        score: { type: 'number' },
        label: {
          type: 'string',
          enum: ['Excellent Fit', 'Strong Fit', 'Moderate Fit', 'Weak Fit'],
        },
        summary: { type: 'string' },
      },
      required: ['score', 'label', 'summary'],
    },
    evaluation_areas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          items: {
            type: 'array',
            items: { type: 'string' },
          },
          level: {
            type: 'string',
            enum: ['Expert', 'Advanced', 'Qualified', 'Limited'],
          },
          score: { type: 'number' },
          evidence: { type: 'string' },
        },
        required: ['category', 'items', 'level', 'score', 'evidence'],
      },
    },
    assessment: {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        strengths: {
          type: 'array',
          items: { type: 'string' },
        },
        gaps: {
          type: 'array',
          items: { type: 'string' },
        },
        risks: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['summary', 'strengths', 'gaps', 'risks'],
    },
    signals: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          value: { type: 'string' },
          score: { type: 'number' },
        },
        required: ['label', 'value', 'score'],
      },
    },
    interview_focus: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: [
    'candidate',
    'match',
    'evaluation_areas',
    'assessment',
    'signals',
    'interview_focus',
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
  const candidate = (result.candidate && typeof result.candidate === 'object')
    ? result.candidate as Record<string, unknown>
    : {}
  const match = (result.match && typeof result.match === 'object')
    ? result.match as Record<string, unknown>
    : {}
  const assessment = (result.assessment && typeof result.assessment === 'object')
    ? result.assessment as Record<string, unknown>
    : {}
  const matchLabel = typeof match.label === 'string' ? match.label : 'Weak Fit'

  return {
    candidate: {
      name: typeof candidate.name === 'string' ? candidate.name : 'Candidate',
      current_title: typeof candidate.current_title === 'string' ? candidate.current_title : 'Title not clearly demonstrated',
      location: typeof candidate.location === 'string' ? candidate.location : 'Not clearly demonstrated',
      experience_years: normalizeScore(candidate.experience_years),
      availability: typeof candidate.availability === 'string' ? candidate.availability : 'Not clearly demonstrated',
    },
    match: {
      score: normalizeScore(match.score),
      label: ['Excellent Fit', 'Strong Fit', 'Moderate Fit', 'Weak Fit'].includes(matchLabel)
        ? matchLabel as AnalysisResults['match']['label']
        : 'Weak Fit',
      summary: typeof match.summary === 'string' ? match.summary : '',
    },
    evaluation_areas: Array.isArray(result.evaluation_areas)
      ? result.evaluation_areas
        .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
        .map((item) => {
          const level = typeof item.level === 'string' ? item.level : 'Limited'

          return {
            category: typeof item.category === 'string' ? item.category : 'Evaluation Area',
            items: Array.isArray(item.items) ? item.items.filter(entry => typeof entry === 'string') : [],
            level: ['Expert', 'Advanced', 'Qualified', 'Limited'].includes(level)
              ? level as AnalysisResults['evaluation_areas'][number]['level']
              : 'Limited',
            score: normalizeScore(item.score),
            evidence: typeof item.evidence === 'string' ? item.evidence : 'Insufficient evidence.',
          }
        })
      : [],
    assessment: {
      summary: typeof assessment.summary === 'string' ? assessment.summary : '',
      strengths: Array.isArray(assessment.strengths) ? assessment.strengths.filter(item => typeof item === 'string') : [],
      gaps: Array.isArray(assessment.gaps) ? assessment.gaps.filter(item => typeof item === 'string') : [],
      risks: Array.isArray(assessment.risks) ? assessment.risks.filter(item => typeof item === 'string') : [],
    },
    signals: Array.isArray(result.signals)
      ? result.signals
        .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
        .map(item => ({
          label: typeof item.label === 'string' ? item.label : 'Signal',
          value: typeof item.value === 'string' ? item.value : 'Not clearly demonstrated',
          score: normalizeScore(item.score),
        }))
      : [],
    interview_focus: Array.isArray(result.interview_focus) ? result.interview_focus.filter(item => typeof item === 'string') : [],
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const files = await readMultipartFormData(event)
  const uploadedFile = files?.find(file => file.name === 'cv')
  const jobDescriptionField = files?.find(file => file.name === 'jobDescription')
  const jobDescription = jobDescriptionField?.data ? Buffer.from(jobDescriptionField.data).toString('utf8').trim() : ''

  if (!uploadedFile?.data?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A CV file is required.',
    })
  }

  if (!jobDescription) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A job description or recruiter prompt is required.',
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
        'You are an AI recruiter screening assistant.',
        'Analyze the resume against the recruiter input and return only structured JSON.',
        'This is a decision-support tool for structured candidate screening, not a final hiring decision.',
        `Recruiter input: ${jobDescription}`,
        'Ground every judgment in the recruiter input and visible resume evidence only.',
        'Do not invent experience, skills, seniority, achievements, or personal traits.',
        'Do not infer protected or sensitive attributes.',
        'The system must work for any role and must not hardcode role-specific logic.',
        'Infer evaluation criteria dynamically from the recruiter input.',
        'When evidence is missing or ambiguous, use phrases like "not clearly demonstrated" or "insufficient evidence".',
        'All scores must be explainable integers from 0 to 100.',
        'Populate every required field in the schema because missing fields break the UI.',
        'candidate should contain only facts clearly supported by the resume.',
        'match.summary and assessment.summary should each be 2 or 3 sentences.',
        'evaluation_areas should contain 3 to 5 recruiter-relevant comparison areas derived from the role.',
        'Each evaluation area must include concise items, a level, a score, and one evidence sentence.',
        'signals should contain 3 concise dashboard signals with label, value, and score.',
        'interview_focus should contain 3 to 5 focused follow-up questions or validation points.',
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
