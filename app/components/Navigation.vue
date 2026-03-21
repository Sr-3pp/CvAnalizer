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
      <nav class="rounded-[1.75rem] border border-slate-200/80 bg-white/85 px-5 py-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1d43b7,#4d7cff)] text-lg font-black tracking-wide text-white shadow-[0_10px_25px_rgba(29,67,183,0.35)]">
              CV
            </div>

            <div>
              <NuxtLink to="/" class="text-lg font-semibold tracking-[0.18em] text-slate-900 uppercase">
                CV Analizer
              </NuxtLink>
              <p class="text-sm text-slate-500">
                Precision resume scoring with AI document review
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <ul class="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
              <li v-for="item in navItems" :key="item.label">
                <a
                  :href="item.to"
                  class="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-[#1d43b7]/30 hover:text-[#1d43b7]"
                >
                  {{ item.label }}
                </a>
              </li>
            </ul>

            <div class="flex items-center gap-3">
              <UBadge class="rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em]" color="neutral" variant="soft">
                AI Powered
              </UBadge>

              <a
                href="#cv-analyzer"
                class="inline-flex items-center rounded-full bg-[#1d43b7] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(29,67,183,0.28)] transition hover:bg-[#18389a]"
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
