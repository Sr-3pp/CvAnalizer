<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'
import type { AppLocaleCode } from '~~/types/i18n'

const emit = defineEmits<{
  'set-results': [results: AnalysisResults]
}>()

const { t, locale } = useI18n()
const cv = ref<File | null>(null)
const errorMessage = ref('')
const isLoading = ref(false)

const handleAnalize = async () => {
  if (!cv.value || !jobDescription.value.trim()) {
    errorMessage.value = t('wizard.errors.missingInputs')
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('cv', cv.value)
    formData.append('jobDescription', jobDescription.value.trim())
    formData.append('locale', locale.value as AppLocaleCode)

    const response = await $fetch<AnalysisResults>('/api/analyze-cv', {
      method: 'POST',
      body: formData,
    })

    emit('set-results', response)
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('wizard.errors.analyzeFailed')
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
            {{ t('wizard.step1') }}
          </p>
          <UIcon class="ml-auto" name="mingcute:document-2-fill" />
        </div>

        <UTextarea
          class="w-full h-full"
          v-model="jobDescription"
          :placeholder="t('wizard.placeholder')"
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
              {{ t('wizard.step2') }}
            </p>
            <UIcon class="ml-auto" name="mingcute:document-2-fill" />
          </div>
          <UFileUpload 
            v-model="cv"
            accept=".pdf,application/pdf"
            :label="t('wizard.uploadLabel')"
            :description="t('wizard.uploadDescription')"
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
            {{ t('wizard.readyTitle') }}
          </h4>
          <p class="text-xs">
            {{ t('wizard.readyDescription') }}
          </p>

          <UButton class="mx-auto" :loading="isLoading" @click="handleAnalize">
            {{ t('wizard.submit') }}
            <UIcon name="ph:lightning-bold" class="inline-block ml-2" />
          </UButton>
        </UCard>
      </div>
    </div>
</template>
