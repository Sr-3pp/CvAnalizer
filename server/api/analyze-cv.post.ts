import { createPartFromUri, GoogleGenAI } from '@google/genai'

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
      'Analyze this CV and provide concise feedback covering strengths, gaps, and suggested improvements.',
      createPartFromUri(processedFile.uri, processedFile.mimeType),
    ],
  })

  if (processedFile.name) {
    await ai.files.delete({ name: processedFile.name }).catch(() => {})
  }

  return {
    analysis: response.text || '',
  }
})
