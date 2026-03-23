<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  summary: string
  isDownloading: boolean
  isShortlisted: boolean
}>()

defineEmits<{
  download: []
  shortlist: []
}>()
</script>

<template>
  <div class="w-full flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
    <div class="max-w-3xl">
      <p class="text-xs">
        {{ t('results.kicker') }}
      </p>
      <h1 class="text-4xl font-bold text-secondary">
        {{ t('results.title') }}
      </h1>
      <p class="mt-2">
        {{ summary }}
      </p>
    </div>

    <div class="flex gap-3">
      <UButton variant="outline" :loading="isDownloading" @click="$emit('download')">
        {{ t('results.download') }}
      </UButton>
      <UButton :variant="isShortlisted ? 'solid' : 'outline'" @click="$emit('shortlist')">
        {{ isShortlisted ? t('results.shortlisted') : t('results.shortlist') }}
      </UButton>
    </div>
  </div>
</template>
