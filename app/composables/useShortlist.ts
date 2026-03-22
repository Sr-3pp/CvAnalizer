import { computed, onMounted, ref, toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

export const useShortlist = (candidate: MaybeRefOrGetter<{
  name: string
  current_title: string
  location: string
}>) => {
  const isShortlisted = ref(false)

  const storageKey = computed(() => {
    const value = toValue(candidate)
    const identity = [value.name, value.current_title, value.location].join('|')

    return `hirelens:shortlist:${identity.toLowerCase()}`
  })

  const loadShortlistState = () => {
    if (import.meta.server) {
      return
    }

    isShortlisted.value = localStorage.getItem(storageKey.value) === 'true'
  }

  const toggleShortlist = () => {
    if (import.meta.server) {
      return
    }

    isShortlisted.value = !isShortlisted.value
    localStorage.setItem(storageKey.value, String(isShortlisted.value))
  }

  onMounted(loadShortlistState)

  watch(storageKey, () => {
    loadShortlistState()
  })

  return {
    isShortlisted,
    toggleShortlist,
  }
}
