<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'
import { downloadAnalysisReport } from '~~/app/utils/pdf-report'

const props = defineProps<{
  results: AnalysisResults
}>()

const isDownloading = ref(false)
const { isShortlisted, toggleShortlist } = useShortlist(computed(() => props.results.candidate))

const downloadReport = () => {
  if (import.meta.server || isDownloading.value) {
    return
  }

  isDownloading.value = true

  try {
    downloadAnalysisReport(props.results, isShortlisted.value)
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
