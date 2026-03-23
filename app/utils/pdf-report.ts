import type { AnalysisResults } from '~~/types/results'
import type { PdfReportTranslations } from '~~/types/i18n'

const defaultPdfTranslations: PdfReportTranslations = {
  reportTitle: 'Candidate Analysis Report',
  candidate: 'Candidate',
  title: 'Title',
  location: 'Location',
  experience: 'Experience',
  availability: 'Availability',
  yearsSuffix: 'years',
  shortlistStatus: 'Shortlist Status',
  shortlisted: 'Shortlisted',
  notShortlisted: 'Not Shortlisted',
  matchScore: 'Match Score',
  matchLabel: 'Match Label',
  summary: 'Summary',
  evaluationAreas: 'Evaluation Areas',
  items: 'Items',
  evidence: 'Evidence',
  assessment: 'Assessment',
  strengths: 'Strengths',
  gaps: 'Gaps',
  risks: 'Risks',
  signals: 'Signals',
  interviewFocus: 'Interview Focus',
  fileSuffix: 'match-report',
  shortlistedFileSuffix: 'shortlisted',
}

const sanitizePdfText = (value: string) => value
  .normalize('NFKD')
  .replace(/[^\x20-\x7E]/g, ' ')
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)')
  .replace(/\s+/g, ' ')
  .trim()

const wrapPdfText = (text: string, maxLength = 88) => {
  const normalized = sanitizePdfText(text)

  if (!normalized) {
    return ['']
  }

  const words = normalized.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word

    if (nextLine.length <= maxLength) {
      currentLine = nextLine
      continue
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    currentLine = word
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

export const buildPdfLines = (
  results: AnalysisResults,
  shortlisted: boolean,
  translations: PdfReportTranslations = defaultPdfTranslations,
) => {
  const lines: string[] = [
    translations.reportTitle,
    '',
    `${translations.candidate}: ${results.candidate.name}`,
    `${translations.title}: ${results.candidate.current_title}`,
    `${translations.location}: ${results.candidate.location}`,
    `${translations.experience}: ${results.candidate.experience_years} ${translations.yearsSuffix}`,
    `${translations.availability}: ${results.candidate.availability}`,
    `${translations.shortlistStatus}: ${shortlisted ? translations.shortlisted : translations.notShortlisted}`,
    '',
    `${translations.matchScore}: ${results.match.score}/100`,
    `${translations.matchLabel}: ${results.match.label}`,
    `${translations.summary}: ${results.match.summary}`,
    '',
    translations.evaluationAreas,
  ]

  for (const area of results.evaluation_areas) {
    lines.push(`${area.category} - ${area.level} (${area.score}/100)`)
    if (area.items.length) {
      lines.push(`${translations.items}: ${area.items.join(', ')}`)
    }
    lines.push(`${translations.evidence}: ${area.evidence}`)
    lines.push('')
  }

  lines.push(translations.assessment)
  lines.push(`${translations.summary}: ${results.assessment.summary}`)

  if (results.assessment.strengths.length) {
    lines.push(`${translations.strengths}:`)
    for (const item of results.assessment.strengths) {
      lines.push(`- ${item}`)
    }
  }

  if (results.assessment.gaps.length) {
    lines.push(`${translations.gaps}:`)
    for (const item of results.assessment.gaps) {
      lines.push(`- ${item}`)
    }
  }

  if (results.assessment.risks.length) {
    lines.push(`${translations.risks}:`)
    for (const item of results.assessment.risks) {
      lines.push(`- ${item}`)
    }
  }

  if (results.signals.length) {
    lines.push('', translations.signals)
    for (const signal of results.signals) {
      lines.push(`- ${signal.label}: ${signal.value} (${signal.score}/100)`)
    }
  }

  if (results.interview_focus.length) {
    lines.push('', translations.interviewFocus)
    for (const item of results.interview_focus) {
      lines.push(`- ${item}`)
    }
  }

  return lines.flatMap(line => wrapPdfText(line))
}

const createPdfBlob = (lines: string[]) => {
  const pageWidth = 612
  const pageHeight = 792
  const margin = 56
  const lineHeight = 16
  const usableHeight = pageHeight - margin * 2
  const linesPerPage = Math.max(1, Math.floor(usableHeight / lineHeight))
  const pages: string[][] = []

  for (let index = 0; index < lines.length; index += linesPerPage) {
    pages.push(lines.slice(index, index + linesPerPage))
  }

  const objects: string[] = []
  const pageObjectIds: number[] = []
  const contentObjectIds: number[] = []

  const addObject = (body: string) => {
    objects.push(body)
    return objects.length
  }

  const fontObjectId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

  for (const pageLines of pages) {
    const content = [
      'BT',
      `/F1 12 Tf`,
      `${margin} ${pageHeight - margin} Td`,
      `${lineHeight} TL`,
      ...pageLines.map((line, index) => `${index === 0 ? '' : 'T* ' }(${sanitizePdfText(line)}) Tj`.trim()),
      'ET',
    ].join('\n')

    const contentObjectId = addObject(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
    contentObjectIds.push(contentObjectId)
    pageObjectIds.push(0)
  }

  const pagesObjectId = addObject('')

  pageObjectIds.forEach((_, index) => {
    pageObjectIds[index] = addObject(
      `<< /Type /Page /Parent ${pagesObjectId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectIds[index]} 0 R >>`,
    )
  })

  objects[pagesObjectId - 1] = `<< /Type /Pages /Count ${pageObjectIds.length} /Kids [${pageObjectIds.map(id => `${id} 0 R`).join(' ')}] >>`

  const catalogObjectId = addObject(`<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`)

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = [0]

  objects.forEach((body, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`
  })

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'

  for (let index = 1; index < offsets.length; index++) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjectId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return new Blob([pdf], { type: 'application/pdf' })
}

export const downloadAnalysisReport = (
  results: AnalysisResults,
  shortlisted: boolean,
  translations: PdfReportTranslations = defaultPdfTranslations,
) => {
  const pdfLines = buildPdfLines(results, shortlisted, translations)
  const pdfBlob = createPdfBlob(pdfLines)
  const url = URL.createObjectURL(pdfBlob)
  const link = document.createElement('a')
  const slug = results.candidate.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'candidate'

  link.href = url
  link.download = `${slug}${shortlisted ? `-${translations.shortlistedFileSuffix}` : ''}-${translations.fileSuffix}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
