<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'

const props = defineProps<{
  results: AnalysisResults
}>()

const candidateInitials = computed(() => {
  const parts = props.results.candidate.name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('') || 'CV'
})
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
          <UButton variant="outline">
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
