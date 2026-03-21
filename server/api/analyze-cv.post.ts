import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { cvText } = await readBody<{ cvText?: string }>(event)

  if (!cvText?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'CV text is required.',
    })
  }

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_GEMINI_API is not configured.',
    })
  }

  const genAI = new GoogleGenerativeAI(config.geminiApiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
  })

  const prompt = [
    'Analyze the following CV and provide concise feedback.',
    'Cover strengths, gaps, and suggested improvements.',
    '',
    cvText,
  ].join('\n')

  const result = await model.generateContent(prompt)
  const response = await result.response

  return {
    analysis: response.text(),
  }
})
