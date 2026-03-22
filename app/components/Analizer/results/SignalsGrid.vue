<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'

defineProps<{
  signals: AnalysisResults['signals']
}>()
</script>

<template>
  <UPageGrid :ui="{ base: 'grid-cols-1 md:grid-cols-3 gap-6' }">
    <UCard v-for="signal in signals" :key="signal.label">
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
</template>
