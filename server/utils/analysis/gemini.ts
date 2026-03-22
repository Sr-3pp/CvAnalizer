import { createPartFromUri, GoogleGenAI } from '@google/genai'
import { analysisResultsSchema } from './schema'
import { buildAnalysisPrompt } from './prompt'

type GeminiAnalysisInput = {
  apiKey: string
  fileName: string
  fileData: Uint8Array
  mimeType: string
  jobDescription: string
}

const uploadResumeFile = async (ai: GoogleGenAI, fileName: string, fileData: Uint8Array, mimeType: string) => {
  const fileBuffer = fileData.buffer.slice(
    fileData.byteOffset,
    fileData.byteOffset + fileData.byteLength,
  )
  const fileBlob = new Blob([fileBuffer], { type: mimeType })

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
        buildAnalysisPrompt(jobDescription),
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
