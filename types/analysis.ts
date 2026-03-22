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
}

export type GeminiAnalysisInput = {
  apiKey: string
  fileName: string
  fileData: Uint8Array
  mimeType: string
  jobDescription: string
}
