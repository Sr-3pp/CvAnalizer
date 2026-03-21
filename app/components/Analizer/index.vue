<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results';

const results = ref<AnalysisResults>()
</script>

<template>
    <UContainer id="cv-analyzer" class="py-10">
        <template v-if="!results">
            <AnalizerWelcome @set-results="results = $event" />
        </template>
        <template v-else>
            <div id="analysis-results">
                <AnalizerResults :results="results" />
            </div>
        </template>
    </UContainer>
</template>
