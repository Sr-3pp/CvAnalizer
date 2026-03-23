import { generateAnalysis } from '../utils/analysis/gemini'
import { normalizeAnalysisResults } from '../utils/analysis/normalize'
import { readAnalysisRequest } from '../utils/analysis/request'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { uploadedFile, jobDescription, mimeType, locale } = await readAnalysisRequest(event)

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_GEMINI_API is not configured.',
    })
  }

  const rawAnalysis = await generateAnalysis({
    apiKey: config.geminiApiKey,
    fileName: uploadedFile.filename || 'cv.pdf',
    fileData: new Uint8Array(uploadedFile.data),
    mimeType,
    jobDescription,
    locale,
  })

  return normalizeAnalysisResults(rawAnalysis)
})
