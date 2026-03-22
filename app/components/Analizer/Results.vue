<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'

const props = defineProps<{
  results: AnalysisResults
}>()

const isDownloading = ref(false)

const candidateInitials = computed(() => {
  const parts = props.results.candidate.name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('') || 'CV'
})

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

const buildPdfLines = (results: AnalysisResults) => {
  const lines: string[] = [
    'Candidate Analysis Report',
    '',
    `Candidate: ${results.candidate.name}`,
    `Title: ${results.candidate.current_title}`,
    `Location: ${results.candidate.location}`,
    `Experience: ${results.candidate.experience_years} years`,
    `Availability: ${results.candidate.availability}`,
    '',
    `Match Score: ${results.match.score}/100`,
    `Match Label: ${results.match.label}`,
    `Summary: ${results.match.summary}`,
    '',
    'Evaluation Areas',
  ]

  for (const area of results.evaluation_areas) {
    lines.push(`${area.category} - ${area.level} (${area.score}/100)`)
    if (area.items.length) {
      lines.push(`Items: ${area.items.join(', ')}`)
    }
    lines.push(`Evidence: ${area.evidence}`)
    lines.push('')
  }

  lines.push('Assessment')
  lines.push(`Summary: ${results.assessment.summary}`)

  if (results.assessment.strengths.length) {
    lines.push('Strengths:')
    for (const item of results.assessment.strengths) {
      lines.push(`- ${item}`)
    }
  }

  if (results.assessment.gaps.length) {
    lines.push('Gaps:')
    for (const item of results.assessment.gaps) {
      lines.push(`- ${item}`)
    }
  }

  if (results.assessment.risks.length) {
    lines.push('Risks:')
    for (const item of results.assessment.risks) {
      lines.push(`- ${item}`)
    }
  }

  if (results.signals.length) {
    lines.push('', 'Signals')
    for (const signal of results.signals) {
      lines.push(`- ${signal.label}: ${signal.value} (${signal.score}/100)`)
    }
  }

  if (results.interview_focus.length) {
    lines.push('', 'Interview Focus')
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

const downloadReport = () => {
  if (import.meta.server || isDownloading.value) {
    return
  }

  isDownloading.value = true

  try {
    const pdfLines = buildPdfLines(props.results)
    const pdfBlob = createPdfBlob(pdfLines)
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    const slug = props.results.candidate.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'candidate'

    link.href = url
    link.download = `${slug}-match-report.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  finally {
    isDownloading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <div class="w-full flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-3xl">
          <p class="text-xs">
            CANDIDATE ANALYSIS
          </p>
          <h1 class="text-4xl font-bold text-secondary">
            Job Match Analysis
          </h1>
        </div>

        <div class="flex gap-3">
          <UButton variant="outline" :loading="isDownloading" @click="downloadReport">
            Download Match Report
          </UButton>
          <UButton>
            Shortlist Candidate
          </UButton>
        </div>
      </div>
    </div>

    <UPageGrid :ui="{ base: 'grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6' }">
      <AnalizerOverallScore
        :score="results.match.score"
        :label="results.match.label"
        :summary="results.match.summary"
      />

      <UCard :ui="{ body: 'flex flex-col gap-6' }">
        <p class="font-bold text-2xl text-secondary">
          Comparison Matrix
        </p>

        <ul class="flex flex-col gap-6">
          <li
            v-for="area in results.evaluation_areas"
            :key="`${area.category}-${area.level}`"
            class="grid gap-4 xl:grid-cols-[1.4fr_minmax(240px,1fr)]"
          >
            <div>
              <p class="text-xs uppercase tracking-wide text-muted mb-2">
                {{ area.category }}
              </p>
              <ul v-if="area.items.length" class="flex flex-wrap gap-2 mb-3">
                <li v-for="item in area.items" :key="item">
                  <UBadge color="secondary" variant="soft">
                    {{ item }}
                  </UBadge>
                </li>
              </ul>
              <p class="text-sm">
                {{ area.evidence }}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <UProgress :model-value="area.score" class="flex-1" />
              <span class="min-w-20 text-sm font-semibold text-secondary text-right">
                {{ area.level }}
              </span>
            </div>
          </li>
        </ul>
      </UCard>
    </UPageGrid>

    <UPageGrid :ui="{ base: 'grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6' }">
      <UCard>
        <div class="flex items-center gap-3 mb-4">
          <div class="flex size-14 items-center justify-center rounded-xl bg-accented text-lg font-bold text-secondary">
            {{ candidateInitials }}
          </div>
          <div>
            <p class="font-semibold text-lg">
              {{ results.candidate.name }}
            </p>
            <p class="text-sm text-muted">
              {{ results.candidate.current_title }}
            </p>
          </div>
        </div>

        <ul class="flex flex-col divide-y divide-default">
          <li class="flex items-center justify-between py-3 gap-4">
            <span class="text-sm text-muted">Location</span>
            <span class="text-sm font-medium text-right">{{ results.candidate.location }}</span>
          </li>
          <li class="flex items-center justify-between py-3 gap-4">
            <span class="text-sm text-muted">Experience</span>
            <span class="text-sm font-medium text-right">{{ results.candidate.experience_years }} years</span>
          </li>
          <li class="flex items-center justify-between py-3 gap-4">
            <span class="text-sm text-muted">Availability</span>
            <span class="text-sm font-medium text-right">{{ results.candidate.availability }}</span>
          </li>
        </ul>
      </UCard>

      <UCard :ui="{ body: 'flex flex-col gap-5' }">
        <p class="font-bold text-xl text-secondary">
          Recruiter Assessment
        </p>

        <p>
          {{ results.assessment.summary }}
        </p>

        <ul class="flex flex-col gap-3">
          <li v-for="item in results.assessment.strengths" :key="`strength-${item}`" class="flex gap-2">
            <UIcon name="mdi:check-circle-outline" class="inline-block flex-shrink-0 mt-1 text-secondary" />
            <p>{{ item }}</p>
          </li>
          <li v-for="item in results.assessment.gaps" :key="`gap-${item}`" class="flex gap-2">
            <UIcon name="ph:warning-circle" class="inline-block flex-shrink-0 mt-1 text-amber-500" />
            <p>{{ item }}</p>
          </li>
          <li v-for="item in results.assessment.risks" :key="`risk-${item}`" class="flex gap-2">
            <UIcon name="ph:warning" class="inline-block flex-shrink-0 mt-1 text-red-500" />
            <p>{{ item }}</p>
          </li>
        </ul>
      </UCard>
    </UPageGrid>

    <UPageGrid :ui="{ base: 'grid-cols-1 md:grid-cols-3 gap-6' }">
      <UCard v-for="signal in results.signals" :key="signal.label">
        <div class="flex items-start gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-accented text-secondary">
            <UIcon name="ph:trend-up-bold" />
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-muted">
              {{ signal.label }}
            </p>
            <p class="text-lg font-semibold">
              {{ signal.value }}
            </p>
          </div>
        </div>
      </UCard>
    </UPageGrid>

    <UCard>
      <h2 class="text-xl font-bold mb-3">
        Interview Focus
      </h2>
      <ul class="flex flex-col gap-3">
        <li v-for="item in results.interview_focus" :key="item" class="flex gap-2">
          <UIcon name="ph:question-bold" class="inline-block flex-shrink-0 mt-1 text-secondary" />
          <p>
            {{ item }}
          </p>
        </li>
      </ul>
    </UCard>
  </div>
</template>
