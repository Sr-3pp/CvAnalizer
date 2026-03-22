<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'

const emit = defineEmits<{
  'set-results': [results: AnalysisResults]
}>()

const cv = ref<File | null>(null)
const errorMessage = ref('')
const isLoading = ref(false)

const handleAnalize = async () => {
  if (!cv.value || !jobDescription.value.trim()) {
    errorMessage.value = 'Add a job description and upload a PDF resume.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('cv', cv.value)
    formData.append('jobDescription', jobDescription.value.trim())

    const response = await $fetch<AnalysisResults>('/api/analyze-cv', {
      method: 'POST',
      body: formData,
    })

    emit('set-results', response)
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to analyze the resume.'
  }
  finally {
    isLoading.value = false
  }
}

const jobDescription = ref('')

</script>

<template>
    <div class="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard
        class="col-span-1 md:col-span-2 h-full"
        :ui="{
          body: 'h-full flex flex-col gap-4'
        }"
      >
        <div class="flex items-center gap-4">
          <span class="bg-secondary rounded-sm size-6 flex items-center justify-center text-white font-bold">
            1
          </span>
          <p>
            Step 1: Paste Role Requirements
          </p>
          <UIcon class="ml-auto" name="mingcute:document-2-fill" />
        </div>

        <UTextarea
          class="w-full h-full"
          v-model="jobDescription"
          placeholder="Paste the job description or recruiter prompt. Include required criteria, preferred criteria, responsibilities, and context for the role..."
          :ui="{
            base: 'mt-4 h-full p-4',
          }"
        />
      </UCard>
      <div class="flex flex-col gap-6">
        <UCard
          :ui="{
            body: 'flex flex-col gap-4'
          }"
        >
          <div class="flex items-center gap-4">
            <span class="bg-secondary rounded-sm size-6 flex items-center justify-center text-white font-bold">
              2
            </span>
            <p>
              Step 2: Upload Candidate Resume
            </p>
            <UIcon class="ml-auto" name="mingcute:document-2-fill" />
          </div>
          <UFileUpload 
            v-model="cv"
            accept=".pdf,application/pdf"
            label="Drop your PDF here."
            description="SUPPORTED FORMATS: PDF ONLY (MAX 5MB)"
          />
          <UAlert
            v-if="errorMessage"
            color="error"
            variant="soft"
            :title="errorMessage"
          />
        </UCard>

        <UCard
          :ui="{
            body: 'flex flex-col items-start gap-4',
          }"
        >
          <h4 class="font-bold">
            Ready to Screen?
          </h4>
          <p class="text-xs">
            The analysis compares recruiter requirements against the submitted resume and returns structured screening guidance.
          </p>

          <UButton class="mx-auto" :loading="isLoading" @click="handleAnalize">
            Run Screening Analysis
            <UIcon name="ph:lightning-bold" class="inline-block ml-2" />
          </UButton>
        </UCard>
      </div>
    </div>
</template>
