import type { AppLocaleCode } from './i18n'

export type MultipartAnalysisFile = {
  name?: string
  filename?: string
  type?: string
  data: Uint8Array
}

export type AnalysisRequestPayload = {
  uploadedFile: MultipartAnalysisFile
  jobDescription: string
  mimeType: string
  locale: AppLocaleCode
}

export type GeminiAnalysisInput = {
  apiKey: string
  fileName: string
  fileData: Uint8Array
  mimeType: string
  jobDescription: string
  locale: AppLocaleCode
}
