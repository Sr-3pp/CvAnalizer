<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'

defineProps<{
  evaluationAreas: AnalysisResults['evaluation_areas']
}>()
</script>

<template>
  <UCard :ui="{ body: 'flex flex-col gap-6' }">
    <p class="font-bold text-2xl text-secondary">
      Comparison Matrix
    </p>

    <ul class="flex flex-col gap-6">
      <li
        v-for="area in evaluationAreas"
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
</template>
