import type { H3Event } from 'h3'

export type AnalysisRequestPayload = {
  uploadedFile: NonNullable<Awaited<ReturnType<typeof readMultipartFormData>>>[number]
  jobDescription: string
  mimeType: string
}

export const readAnalysisRequest = async (event: H3Event): Promise<AnalysisRequestPayload> => {
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
