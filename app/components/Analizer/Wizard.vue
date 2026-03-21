<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'

const emit = defineEmits<{
  'set-results': [results: AnalysisResults]
}>()

const cv = ref<File | null>(null)
const errorMessage = ref('')
const isLoading = ref(false)

const handleAnalize = async () => {
  if (!cv.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('cv', cv.value)

    const response = await $fetch<AnalysisResults>('/api/analyze-cv', {
      method: 'POST',
      body: formData,
    })

    emit('set-results', response)
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to analyze the CV.'
  }
  finally {
    isLoading.value = false
  }
}

</script>

<template>
    <div class="space-y-4 flex flex-col items-center">
      <UFileUpload v-model="cv" accept=".pdf,application/pdf" label="Drop your PDF here." description="SUPPORTED FORMATS: PDF ONLY (MAX 5MB)" />
      <UButton class="mx-auto" :loading="isLoading" @click="handleAnalize">
        Analyze Resume
      </UButton>
      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :title="errorMessage"
      />
    </div>
</template>
