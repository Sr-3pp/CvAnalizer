<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'

defineEmits<{
    'set-results': [results: AnalysisResults]
}>()

const carousel = [
  {
    icon: 'mdi:file-document-search-outline',
    title: 'Evidence-Based Matching',
    description: 'Each requirement is compared against resume evidence so recruiters can see what is clearly matched and what is missing or unclear.',
  },
  {
    icon: 'mdi:tune-variant',
    title: 'Structured, Explainable Scores',
    description: 'Scores are broken down by technical fit, experience relevance, seniority alignment, communication clarity, and confidence.',
  },
  {
    icon: 'mdi:account-check-outline',
    title: 'Recruiter-Ready Next Steps',
    description: 'Get a clear recommendation, strengths, risks, and targeted follow-up interview questions to support consistent pre-screening decisions.',
  },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <UBadge class="mx-auto">
      Recruiter Screening
    </UBadge>

    <p class="text-6xl text-center font-bold">
      Screen Candidates With <span class="text-secondary">Clear Evidence.</span>
    </p>

    <p class="text-center max-w-xl mx-auto">
      Paste the role requirements, upload a resume, and get a structured screening analysis that highlights fit, gaps, risks, and follow-up questions.
    </p>

    <AnalizerWizard @set-results="$emit('set-results', $event)" />

    <ul class="flex justify-evenly">
      <li class="flex items-center">
        <UIcon name="ph:lock-key-duotone" class="inline-block mr-2" />
        <p>
          Secure Processing
        </p>
      </li>
      <li class="flex items-center">
        <UIcon name="mdi:lightning-bolt-outline" class="inline-block mr-2" />
        <p>
          Fast Screening
        </p>
      </li>
      <li class="flex items-center">
        <UIcon name="mdi:shield-lock-outline" class="inline-block mr-2" />
        <p>
          Evidence First
        </p>
      </li>
    </ul>

    <UPageGrid :ui="{ base: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' }">
      <UCarousel
        dots
        :items="carousel"
        v-slot="{ item: slide }"
        class="md:col-span-2"
        :ui="{
            container: 'items-stretch',
            item: 'flex',
            dots: 'justify-start pl-10 bottom-10',
            dot: 'rounded-none h-1 transition-all data-[state=active]:bg-secondary data-[state=active]:w-10'
        }"
      >
        <UCard class="pb-10 m-3 w-full">
          <UIcon :name="slide.icon" class="inline-block mr-2 mb-4" />
          <p class=" text-xl font-semibold mb-2">
            {{ slide.title }}
          </p>

          <p class="max-w-sm">
            {{ slide.description }}
          </p>
        </UCard>
      </UCarousel>

      <UCard class="bg-accented">
        <p class="text-xl font-bold mb-4">
          Structured Pre-Screening
        </p>

        <p class="mb-2">
          Support recruiter decisions with role-based analysis grounded in visible resume evidence, not vague AI scoring.
        </p>

        <NuxtLink to="/about" class="text-blue-500 hover:underline flex items-center">
          Learn more about our process
          <UIcon name="mdi:arrow-right" class="inline-block ml-1" />
        </NuxtLink>
      </UCard>
    </UPageGrid>
  </div>
</template>
