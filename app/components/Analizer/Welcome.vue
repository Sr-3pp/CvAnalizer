<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'

defineEmits<{
    'set-results': [results: AnalysisResults]
}>()

const { t } = useI18n()

const carousel = computed(() => [
  {
    icon: 'mdi:file-document-search-outline',
    title: t('welcome.carousel.matching.title'),
    description: t('welcome.carousel.matching.description'),
  },
  {
    icon: 'mdi:tune-variant',
    title: t('welcome.carousel.scores.title'),
    description: t('welcome.carousel.scores.description'),
  },
  {
    icon: 'mdi:account-check-outline',
    title: t('welcome.carousel.nextSteps.title'),
    description: t('welcome.carousel.nextSteps.description'),
  },
])
</script>

<template>
  <div class="flex flex-col gap-8">
    <UBadge class="mx-auto">
      {{ t('welcome.badge') }}
    </UBadge>

    <p class="text-6xl text-center font-bold">
      {{ t('welcome.title') }}
    </p>

    <p class="text-center max-w-xl mx-auto">
      {{ t('welcome.description') }}
    </p>

    <AnalizerWizard @set-results="$emit('set-results', $event)" />

    <ul class="flex justify-evenly">
      <li class="flex items-center">
        <UIcon name="ph:lock-key-duotone" class="inline-block mr-2" />
        <p>
          {{ t('welcome.signals.secure') }}
        </p>
      </li>
      <li class="flex items-center">
        <UIcon name="mdi:lightning-bolt-outline" class="inline-block mr-2" />
        <p>
          {{ t('welcome.signals.fast') }}
        </p>
      </li>
      <li class="flex items-center">
        <UIcon name="mdi:shield-lock-outline" class="inline-block mr-2" />
        <p>
          {{ t('welcome.signals.evidence') }}
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
          {{ t('welcome.panel.title') }}
        </p>

        <p class="mb-2">
          {{ t('welcome.panel.description') }}
        </p>

        <NuxtLink to="/about" class="text-blue-500 hover:underline flex items-center">
          {{ t('welcome.panel.link') }}
          <UIcon name="mdi:arrow-right" class="inline-block ml-1" />
        </NuxtLink>
      </UCard>
    </UPageGrid>
  </div>
</template>
