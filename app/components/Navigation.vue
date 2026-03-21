<script setup lang="ts">
const navItems = [
  {
    label: 'Overview',
    to: '#cv-analyzer',
  },
  {
    label: 'Results',
    to: '#analysis-results',
  },
]
</script>

<template>
  <header class="sticky top-0 z-30 px-4 pt-4 sm:px-6">
    <UContainer>
      <nav class="rounded-[1.75rem] border px-5 py-4 backdrop-blur-xl">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black tracking-wide">
              CV
            </div>

            <div>
              <NuxtLink to="/" class="text-lg font-semibold uppercase">
                CV Analizer
              </NuxtLink>
              <p class="text-sm">
                Precision resume scoring with AI document review
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <ul class="flex flex-wrap items-center gap-2 text-sm font-medium">
              <li v-for="item in navItems" :key="item.label">
                <a
                  :href="item.to"
                  class="inline-flex items-center rounded-full px-4 py-2 transition"
                >
                  {{ item.label }}
                </a>
              </li>
            </ul>

            <div class="flex items-center gap-3">
              <UBadge class="rounded-full px-3 py-1 font-semibold uppercase" color="neutral" variant="soft">
                AI Powered
              </UBadge>

              <a
                href="#cv-analyzer"
                class="inline-flex items-center rounded-full px-5 text-sm font-semibold transition"
              >
                Analyze Resume
              </a>
            </div>
          </div>
        </div>
      </nav>
    </UContainer>
  </header>
</template>
