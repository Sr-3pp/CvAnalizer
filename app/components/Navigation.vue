<script setup lang="ts">
const { t, locale, setLocale } = useI18n()

const languageItems = computed(() => [
  {
    label: 'English (EN)',
    icon: locale.value === 'en' ? 'mdi:check' : 'mdi:translate',
    onSelect: () => setLocale('en'),
  },
  {
    label: 'Español (ES)',
    icon: locale.value === 'es' ? 'mdi:check' : 'mdi:translate',
    onSelect: () => setLocale('es'),
  },
])
</script>

<template>
  <header class="sticky top-0 z-30 backdrop-blur-xl bg-black/6 dark:bg-white/6">
    <UContainer>
      <nav class="px-5 py-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black tracking-wide">
              HL
            </div>

            <div>
              <NuxtLink to="/" class="text-lg font-semibold uppercase">
                HireLens
              </NuxtLink>
              <p class="text-sm">
                {{ t('nav.subtitle') }}
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <div class="flex items-center gap-3">
              <UBadge class="rounded-full px-3 py-1 font-semibold uppercase" color="neutral" variant="soft">
                {{ t('nav.badge') }}
              </UBadge>

              <UDropdownMenu :items="languageItems">
                <UButton size="xs" variant="ghost" icon="mdi:translate">
                  {{ locale.toUpperCase() }}
                </UButton>
              </UDropdownMenu>

              <UColorModeSwitch />
            </div>
          </div>
        </div>
      </nav>
    </UContainer>
  </header>
</template>
