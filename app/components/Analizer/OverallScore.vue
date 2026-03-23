<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  score: number
  label?: string
  summary?: string
}>()

const normalizedScore = computed(() => Math.min(100, Math.max(0, Math.round(props.score))))
const radius = 132
const circumference = 2 * Math.PI * radius
const dashOffset = computed(() => circumference * (1 - normalizedScore.value / 100))

const scoreLabel = computed(() => {
  if (props.label) {
    return props.label
  }

  if (normalizedScore.value >= 85) {
    return t('results.fallbackLabels.strongInterviewCase')
  }

  if (normalizedScore.value >= 70) {
    return t('results.fallbackLabels.promisingMatch')
  }

  if (normalizedScore.value >= 50) {
    return t('results.fallbackLabels.mixedEvidence')
  }

  return t('results.fallbackLabels.lowMatchConfidence')
})
</script>

<template>
  <UCard>
    <div class="flex flex-col items-center gap-7 text-center">
      <div class="space-y-1">
        <p class="text-xs font-semibold uppercase">
          {{ t('results.matchScore') }}
        </p>
      </div>

      <div class="relative flex h-[15rem] w-[15rem] items-center justify-center max-w-full">
        <svg class="h-full w-full -rotate-90" viewBox="0 0 320 320" aria-hidden="true">
          <circle
            cx="160"
            cy="160"
            :r="radius"
            fill="none"
            stroke="var(--ui-bg-accented)"
            stroke-linecap="round"
            stroke-width="18"
          />
          <circle
            cx="160"
            cy="160"
            :r="radius"
            fill="none"
            stroke="var(--color-primary)"
            stroke-dasharray="829.3804605477054"
            :stroke-dashoffset="dashOffset"
            stroke-linecap="round"
            stroke-width="18"
          />
        </svg>

        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <p class="text-7xl font-bold leading-none tracking-tight">
            {{ normalizedScore }}
          </p>
          <p class="mt-3 text-3xl font-semibold leading-none">
            / 100
          </p>
        </div>
      </div>

      <div class="rounded-2xl px-8 py-4 text-lg font-semibold">
        {{ scoreLabel }}
      </div>

      <p v-if="summary" class="text-sm max-w-xs text-muted text-left text-balance">
        {{ summary }}
      </p>
    </div>
  </UCard>
</template>
