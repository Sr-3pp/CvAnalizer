<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'

const props = defineProps<{
  candidate: AnalysisResults['candidate']
  isShortlisted: boolean
}>()

const candidateInitials = computed(() => {
  const parts = props.candidate.name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('') || 'CV'
})
</script>

<template>
  <UCard>
    <div class="flex items-center gap-3 mb-4">
      <div class="flex size-14 items-center justify-center rounded-xl bg-accented text-lg font-bold text-secondary">
        {{ candidateInitials }}
      </div>
      <div>
        <div class="flex items-center gap-2">
          <p class="font-semibold text-lg">
            {{ candidate.name }}
          </p>
          <UBadge v-if="isShortlisted" color="success" variant="soft">
            Shortlisted
          </UBadge>
        </div>
        <p class="text-sm text-muted">
          {{ candidate.current_title }}
        </p>
      </div>
    </div>

    <ul class="flex flex-col divide-y divide-default">
      <li class="flex items-center justify-between py-3 gap-4">
        <span class="text-sm text-muted">Location</span>
        <span class="text-sm font-medium text-right">{{ candidate.location }}</span>
      </li>
      <li class="flex items-center justify-between py-3 gap-4">
        <span class="text-sm text-muted">Experience</span>
        <span class="text-sm font-medium text-right">{{ candidate.experience_years }} years</span>
      </li>
      <li class="flex items-center justify-between py-3 gap-4">
        <span class="text-sm text-muted">Availability</span>
        <span class="text-sm font-medium text-right">{{ candidate.availability }}</span>
      </li>
    </ul>
  </UCard>
</template>
