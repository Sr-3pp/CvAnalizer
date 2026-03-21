<script setup lang="ts">
import type { AnalysisResults } from '~~/types/results'

defineEmits<{
    'set-results': [results: AnalysisResults]
}>()

const carousel = [
    {
        icon: 'mdi:github',
        title: 'Contextual Inelligence',
        description: "Our AI doesn't just scan keywords. It understands the narrative arc of your career, identifying hidden strengths and leadership patterns."
    },
    {
        icon: 'mdi:github',
        title: 'Contextual Inelligence 2',
        description: "Our AI doesn't just scan keywords. It understands the narrative arc of your career, identifying hidden strengths and leadership patterns."
    }
]
</script>

<template>
    <div class="flex flex-col gap-8">
        <UBadge class="mx-auto">
            Ai Powered CV Analizer
        </UBadge>
    
        <p class="text-4xl text-center font-bold">
            Your resume, <i class="text-secondary">Refined</i> by AI.
        </p>
    
        <p class="text-center max-w-xl mx-auto">
            Elevate your professional narrative with our digital curator. We analyze your experience through the lens of industry experts to ensure your talent never goes unnoticed.
        </p>
    
        <AnalizerWizard @set-results="$emit('set-results', $event)" />
    
        <ul class="flex justify-evenly">
            <li class="flex items-center">
                <UIcon name="ph:lock-key-duotone" class="inline-block mr-2" />
                <p>
                    Secure Processing
                </p>
            </li>
            <li class="flex items-center">
                <UIcon name="mdi:lightning-bolt-outline" class="inline-block mr-2" />
                <p>
                    Instant Insights
                </p>
            </li>
            <li class="flex items-center">
                <UIcon name="mdi:shield-lock-outline" class="inline-block mr-2" />
                <p>
                    Privacy Guaranteed
                </p>
            </li>
        </ul>
    
        <UPageGrid :ui="
            {
                base: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
            }
        ">
            <UCarousel
                dots 
                :items="carousel"
                v-slot="{ item: slide }"
                class="md:col-span-2"
                :ui="{
                    container: 'p-3'
                }"
            >
                <UCard>
                    <UIcon :name="slide.icon" class="inline-block mr-2 mb-4" />
                    <p class=" text-xl font-semibold mb-2">
                        {{ slide.title }}
                    </p>
    
                    <p class="max-w-sm">
                        {{ slide.description }}
                    </p>
                </UCard>
            </UCarousel>
    
            <UCard class="bg-accented">
                <p class="text-xl font-bold mb-4">
                    ATS-Optimized
                </p>
    
                <p class="mb-2">
                    Pass through Applicant Tracking Systems with layouts designed for machine readability without sacrificing human aesthetic.
                </p>
    
                <NuxtLink to="/about" class="text-blue-500 hover:underline flex items-center">
                    Learn more about our process
                    <UIcon name="mdi:arrow-right" class="inline-block ml-1" />
                </NuxtLink>
            </UCard>
        </UPageGrid>
    </div>
</template>
