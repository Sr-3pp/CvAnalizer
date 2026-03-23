import { createPartFromUri, GoogleGenAI } from '@google/genai'
import type { GeminiAnalysisInput } from '~~/types/analysis'
import { analysisResultsSchema } from './schema'
import { buildAnalysisPrompt } from './prompt'

const uploadResumeFile = async (ai: GoogleGenAI, fileName: string, fileData: Uint8Array, mimeType: string) => {
  const fileBytes = Uint8Array.from(fileData)
  const fileBlob = new Blob([fileBytes], { type: mimeType })

  return ai.files.upload({
    file: fileBlob,
    config: {
      mimeType,
      displayName: fileName,
    },
  })
}

const waitForProcessedFile = async (ai: GoogleGenAI, fileName: string) => {
  let processedFile = await ai.files.get({ name: fileName })

  while (processedFile.state === 'PROCESSING') {
    await new Promise(resolve => setTimeout(resolve, 1000))
    processedFile = await ai.files.get({ name: fileName })
  }

  if (processedFile.state === 'FAILED' || !processedFile.uri || !processedFile.mimeType) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Gemini could not process the uploaded PDF.',
    })
  }

  return processedFile
}

export const generateAnalysis = async ({
  apiKey,
  fileName,
  fileData,
  mimeType,
  jobDescription,
  locale,
}: GeminiAnalysisInput) => {
  const ai = new GoogleGenAI({ apiKey })
  const uploadedFile = await uploadResumeFile(ai, fileName, fileData, mimeType)

  try {
    const processedFile = uploadedFile.name
      ? await waitForProcessedFile(ai, uploadedFile.name)
      : uploadedFile

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        buildAnalysisPrompt(jobDescription, locale),
        createPartFromUri(processedFile.uri!, processedFile.mimeType!),
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisResultsSchema,
      },
    })

    return JSON.parse(response.text || '{}')
  }
  finally {
    if (uploadedFile.name) {
      await ai.files.delete({ name: uploadedFile.name }).catch(() => {})
    }
  }
}
