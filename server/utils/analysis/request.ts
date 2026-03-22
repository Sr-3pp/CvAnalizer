import type { H3Event } from 'h3'
import type { AnalysisRequestPayload, MultipartAnalysisFile } from '~~/types/analysis'

export const readAnalysisRequest = async (event: H3Event): Promise<AnalysisRequestPayload> => {
  const files = await readMultipartFormData(event)
  const uploadedFile = files?.find(file => file.name === 'cv') as MultipartAnalysisFile | undefined
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

  const mimeType = uploadedFile.type || 'application/pdf'
  if (mimeType !== 'application/pdf') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only PDF CV files are supported.',
    })
  }

  return {
    uploadedFile,
    jobDescription,
    mimeType,
  }
}
