<script setup lang="ts">

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
                Evidence-based recruiter screening for structured candidate review
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <div class="flex items-center gap-3">
              <UBadge class="rounded-full px-3 py-1 font-semibold uppercase" color="neutral" variant="soft">
                Recruiter Dashboard
              </UBadge>

              <UColorModeSwitch />
            </div>
          </div>
        </div>
      </nav>
    </UContainer>
  </header>
</template>
