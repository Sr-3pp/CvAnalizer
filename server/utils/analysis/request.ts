import type { H3Event } from 'h3'
import type { AnalysisRequestPayload, MultipartAnalysisFile } from '~~/types/analysis'
import type { AppLocaleCode } from '~~/types/i18n'

const localeMessages: Record<AppLocaleCode, {
  cvRequired: string
  promptRequired: string
  pdfOnly: string
}> = {
  en: {
    cvRequired: 'A CV file is required.',
    promptRequired: 'A job description or recruiter prompt is required.',
    pdfOnly: 'Only PDF CV files are supported.',
  },
  es: {
    cvRequired: 'Se requiere un archivo de CV.',
    promptRequired: 'Se requiere una descripción del puesto o un prompt del recruiter.',
    pdfOnly: 'Solo se admiten CV en formato PDF.',
  },
}

export const readAnalysisRequest = async (event: H3Event): Promise<AnalysisRequestPayload> => {
  const files = await readMultipartFormData(event)
  const uploadedFile = files?.find(file => file.name === 'cv') as MultipartAnalysisFile | undefined
  const jobDescriptionField = files?.find(file => file.name === 'jobDescription')
  const localeField = files?.find(file => file.name === 'locale')
  const jobDescription = jobDescriptionField?.data ? Buffer.from(jobDescriptionField.data).toString('utf8').trim() : ''
  const localeValue = localeField?.data ? Buffer.from(localeField.data).toString('utf8').trim() : 'en'
  const locale: AppLocaleCode = localeValue === 'es' ? 'es' : 'en'
  const messages = localeMessages[locale]

  if (!uploadedFile?.data?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: messages.cvRequired,
    })
  }

  if (!jobDescription) {
    throw createError({
      statusCode: 400,
      statusMessage: messages.promptRequired,
    })
  }

  const mimeType = uploadedFile.type || 'application/pdf'
  if (mimeType !== 'application/pdf') {
    throw createError({
      statusCode: 400,
      statusMessage: messages.pdfOnly,
    })
  }

  return {
    uploadedFile,
    jobDescription,
    mimeType,
    locale,
  }
}
