<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'
import type { PdfReportTranslations } from '~~/types/i18n'
import { downloadAnalysisReport } from '~~/app/utils/pdf-report'

const props = defineProps<{
  results: AnalysisResults
}>()

const { t } = useI18n()
const isDownloading = ref(false)
const { isShortlisted, toggleShortlist } = useShortlist(computed(() => props.results.candidate))
const pdfTranslations = computed<PdfReportTranslations>(() => ({
  reportTitle: t('pdf.reportTitle'),
  candidate: t('pdf.candidate'),
  title: t('pdf.title'),
  location: t('pdf.location'),
  experience: t('pdf.experience'),
  availability: t('pdf.availability'),
  yearsSuffix: t('pdf.yearsSuffix'),
  shortlistStatus: t('pdf.shortlistStatus'),
  shortlisted: t('pdf.shortlisted'),
  notShortlisted: t('pdf.notShortlisted'),
  matchScore: t('pdf.matchScore'),
  matchLabel: t('pdf.matchLabel'),
  summary: t('pdf.summary'),
  evaluationAreas: t('pdf.evaluationAreas'),
  items: t('pdf.items'),
  evidence: t('pdf.evidence'),
  assessment: t('pdf.assessment'),
  strengths: t('pdf.strengths'),
  gaps: t('pdf.gaps'),
  risks: t('pdf.risks'),
  signals: t('pdf.signals'),
  interviewFocus: t('pdf.interviewFocus'),
  fileSuffix: t('pdf.fileSuffix'),
  shortlistedFileSuffix: t('pdf.shortlistedFileSuffix'),
}))

const downloadReport = () => {
  if (import.meta.server || isDownloading.value) {
    return
  }

  isDownloading.value = true

  try {
    downloadAnalysisReport(props.results, isShortlisted.value, pdfTranslations.value)
  }
  finally {
    isDownloading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <AnalizerResultsHeaderActions
        :summary="results.match.summary"
        :is-downloading="isDownloading"
        :is-shortlisted="isShortlisted"
        @download="downloadReport"
        @shortlist="toggleShortlist"
      />
    </div>

    <UPageGrid :ui="{ base: 'grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6' }">
      <AnalizerOverallScore
        :score="results.match.score"
        :label="results.match.label"
        :summary="results.match.summary"
      />

      <AnalizerResultsComparisonMatrix :evaluation-areas="results.evaluation_areas" />
    </UPageGrid>

    <UPageGrid :ui="{ base: 'grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6' }">
      <AnalizerResultsCandidateCard :candidate="results.candidate" :is-shortlisted="isShortlisted" />
      <AnalizerResultsAssessmentCard :assessment="results.assessment" />
    </UPageGrid>

    <AnalizerResultsSignalsGrid :signals="results.signals" />

    <AnalizerResultsInterviewFocus :items="results.interview_focus" />
  </div>
</template>
