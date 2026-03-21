<script setup lang="ts">
const cv = ref<File | null>(null)
const analysis = ref('')
const errorMessage = ref('')
const isLoading = ref(false)


const handleAnalize = async () => {
  if (!cv.value) return;

  isLoading.value = true
  errorMessage.value = ''
  analysis.value = ''

  try {
    const text = await cv.value.text()
    const response = await $fetch<{ analysis: string }>('/api/analyze-cv', {
      method: 'POST',
      body: {
        cvText: text,
      },
    })

    analysis.value = response.analysis
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
  <UCard>
    <div class="space-y-4">
      <UFileUpload v-model="cv" />
      <UButton :loading="isLoading" @click="handleAnalize">
        Analyze
      </UButton>
      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :title="errorMessage"
      />
      <p v-if="analysis" class="whitespace-pre-wrap text-sm">
        {{ analysis }}
      </p>
    </div>
  </UCard>

</template>
