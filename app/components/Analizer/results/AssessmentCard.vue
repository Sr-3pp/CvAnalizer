<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'

const { t } = useI18n()

defineProps<{
  assessment: AnalysisResults['assessment']
}>()
</script>

<template>
  <UCard :ui="{ body: 'flex flex-col gap-5' }">
    <p class="font-bold text-xl text-secondary">
      {{ t('results.recruiterAssessment') }}
    </p>

    <p>
      {{ assessment.summary }}
    </p>

    <ul class="flex flex-col gap-3">
      <li v-for="item in assessment.strengths" :key="`strength-${item}`" class="flex gap-2">
        <UIcon name="mdi:check-circle-outline" class="inline-block flex-shrink-0 mt-1 text-secondary" />
        <p>{{ item }}</p>
      </li>
      <li v-for="item in assessment.gaps" :key="`gap-${item}`" class="flex gap-2">
        <UIcon name="ph:warning-circle" class="inline-block flex-shrink-0 mt-1 text-amber-500" />
        <p>{{ item }}</p>
      </li>
      <li v-for="item in assessment.risks" :key="`risk-${item}`" class="flex gap-2">
        <UIcon name="ph:warning" class="inline-block flex-shrink-0 mt-1 text-red-500" />
        <p>{{ item }}</p>
      </li>
    </ul>
  </UCard>
</template>
