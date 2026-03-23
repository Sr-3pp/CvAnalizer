<script setup lang="ts">
import { computed } from 'vue'
import { en, es } from '@nuxt/ui/locale'

const { locale } = useI18n()
const uiLocale = computed(() => locale.value === 'es' ? es : en)

useHead({
  htmlAttrs: {
    lang: computed(() => uiLocale.value.code),
    dir: computed(() => uiLocale.value.dir),
  },
})
</script>

<template>
  <UApp :locale="uiLocale">
    <Navigation />
    <NuxtRouteAnnouncer />
    <Analizer />
  </UApp>
</template>
