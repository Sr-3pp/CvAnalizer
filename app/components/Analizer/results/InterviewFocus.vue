<script setup lang="ts">
defineProps<{
  items: string[]
}>()
</script>

<template>
  <UCard>
    <h2 class="text-xl font-bold mb-3">
      Interview Focus
    </h2>
    <ul class="flex flex-col gap-3">
      <li v-for="item in items" :key="item" class="flex gap-2">
        <UIcon name="ph:question-bold" class="inline-block flex-shrink-0 mt-1 text-secondary" />
        <p>
          {{ item }}
        </p>
      </li>
    </ul>
  </UCard>
</template>
