<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'
defineProps<{
    results: AnalysisResults
}>()
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
            <h1 class="text-4xl font-bold">
                Analysis Complete.
            </h1>
            <p>
                Your profile has been curated with editorial precision. Here is how you stand against industry benchmarks.
            </p>
        </div>

        <UPageGrid :ui="
            {
                base: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6',
            }
        ">
            <AnalizerOverallScore :score="results.overallScore" />

            <UCard
                class="md:col-span-2"
                :ui="{
                    body: 'h-full flex flex-col'
                }"
            
            >
                <p class="font-bold text-2xl mb-2">
                    Executive Summary
                </p>

                <p class="mb-6">
                    {{ results.executiveSummary }}
                </p>

                <ul class="flex items-center gap-4 w-full mt-auto">
                    <li class="w-full sm:w-1/3">
                        <p class="flex items-center gap-2">
                            <UIcon name="system-uicons:document" class="inline-block" />
                            <span>
                                READABILITY
                            </span>
                        </p>
                        <UProgress v-model="results.readability" class="inline-block" />
                        <small>
                            {{ results.readability }}%
                        </small>
                    </li>
                    <li class="w-full sm:w-1/3">
                        <p class="flex items-center gap-2">
                            <UIcon name="zmdi:search-in-file" class="inline-block" />
                            <span>
                                KEYWORD Match
                            </span>
                        </p>
                        <UProgress v-model="results.keywordMatch" class="inline-block" />
                        <small>
                            {{ results.keywordMatch }}%
                        </small>
                    </li>
                    <li class="w-full sm:w-1/3">
                        <p class="flex items-center gap-2">
                            <UIcon name="ph:chart-line-up" class="inline-block" />
                            <span>
                                Impact score
                            </span>
                        </p>
                        <UProgress v-model="results.impactScore" class="inline-block" />
                        <small>
                            {{ results.impactScore }}%
                        </small>
                    </li>
                </ul>
            </UCard>
        </UPageGrid>

        <UPageGrid :ui="
            {
                base: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6',
            }
        ">
            <UCard>
                <h3 class="mb-3 text-xl font-semibold flex items-center">
                    <UIcon name="ph:shield-check-bold" class="inline-block mr-2" />
                    Key Strengths
                </h3>

                <ul class="flex flex-col gap-2">
                    <li class="flex gap-2" v-for="strength in results.keyStrengths" :key="strength">
                        <UIcon name="mdi:check-circle-outline" class="inline-block flex-shrink-0 mt-1" />
                        <p>
                            {{ strength }}
                        </p>
                    </li>
                </ul>
            </UCard>

            <UCard>
                <h3 class="mb-3 text-xl font-semibold flex items-center">
                    <UIcon name="ph:lightbulb-filament-fill" class="inline-block mr-2" />
                    Growth Opportunities
                </h3>

                <ul class="flex flex-col gap-2">
                    <li class="flex gap-2" v-for="opportunity in results.growthOpportunities" :key="opportunity">
                        <UIcon name="ph:info" class="inline-block flex-shrink-0 mt-1" />
                        <p>
                            {{ opportunity }}
                        </p>
                    </li>
                </ul>
            </UCard>
        </UPageGrid>

        <UCard 
            :ui="{
                body: 'flex gap-4'
            }"
        >
            <div>
                <h2 class="text-xl font-bold">
                    Ready to optimize?
                </h2>
                <p>
                    Our AI can automatically rewrite your summary and skills section for a perfect 100/100 match.
                </p>
            </div>
            <ul class="flex items-center gap-6 ml-auto">
                <li>
                    <UButton>
                        Optimize Summary
                    </UButton>
                </li>
                <li>
                    <UButton color="secondary">
                        Download Report
                    </UButton>
                </li>
            </ul>
        </UCard>
    </div>
</template>
