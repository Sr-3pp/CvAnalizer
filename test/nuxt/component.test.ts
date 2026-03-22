import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Results from '~~/app/components/Analizer/Results.vue'
import Wizard from '~~/app/components/Analizer/Wizard.vue'
import { analysisResultsFixture } from '../fixtures/analysis-results'

const UTextareaStub = defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
})

const UFileUploadStub = defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: '<button type="button" data-testid="file-upload" @click="$emit(\'update:modelValue\', \'resume.pdf\')">Upload</button>',
})

const UButtonStub = defineComponent({
  props: ['loading', 'variant'],
  emits: ['click'],
  template: '<button type="button" :data-loading="String(loading)" :data-variant="variant" @click="$emit(\'click\')"><slot /></button>',
})

const UAlertStub = defineComponent({
  props: ['title'],
  template: '<div>{{ title }}</div>',
})

const UCardStub = defineComponent({
  template: '<div><slot /></div>',
})

const UPageGridStub = defineComponent({
  template: '<div><slot /></div>',
})

const UBadgeStub = defineComponent({
  template: '<span><slot /></span>',
})

const UProgressStub = defineComponent({
  props: ['modelValue'],
  template: '<div>{{ modelValue }}</div>',
})

const UIconStub = defineComponent({
  template: '<span />',
})

describe('Wizard', () => {
  it('shows a validation error when required inputs are missing', async () => {
    const wrapper = await mountSuspended(Wizard, {
      global: {
        stubs: {
          UTextarea: UTextareaStub,
          UFileUpload: UFileUploadStub,
          UButton: UButtonStub,
          UAlert: UAlertStub,
          UCard: UCardStub,
          UIcon: UIconStub,
        },
      },
    })

    await wrapper.findAll('button')[1]?.trigger('click')

    expect(wrapper.text()).toContain('Add a job description and upload a PDF resume.')
  })

  it('submits recruiter input and emits results while showing loading state', async () => {
    let resolveFetch: (value: typeof analysisResultsFixture) => void = () => {}
    const fetchMock = vi.fn(() => new Promise<typeof analysisResultsFixture>((resolve) => {
      resolveFetch = resolve
    }))

    vi.stubGlobal('$fetch', fetchMock)

    const wrapper = await mountSuspended(Wizard, {
      global: {
        stubs: {
          UTextarea: UTextareaStub,
          UFileUpload: UFileUploadStub,
          UButton: UButtonStub,
          UAlert: UAlertStub,
          UCard: UCardStub,
          UIcon: UIconStub,
        },
      },
    })

    await wrapper.find('textarea').setValue('Senior product designer with leadership experience')
    await wrapper.find('[data-testid="file-upload"]').trigger('click')
    await wrapper.findAll('button')[1]?.trigger('click')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('button')[1]?.attributes('data-loading')).toBe('true')

    resolveFetch(analysisResultsFixture)
    await Promise.resolve()
    await Promise.resolve()

    expect(wrapper.emitted('set-results')?.[0]?.[0]).toEqual(analysisResultsFixture)
  })
})

describe('Results', () => {
  it('renders dashboard data and shortlist badge from persisted state', async () => {
    localStorage.setItem('hirelens:shortlist:alex rivera|senior product designer|brooklyn, ny (hybrid)', 'true')

    const wrapper = await mountSuspended(Results, {
      props: {
        results: analysisResultsFixture,
      },
      global: {
        stubs: {
          UButton: UButtonStub,
          UCard: UCardStub,
          UPageGrid: UPageGridStub,
          UBadge: UBadgeStub,
          UProgress: UProgressStub,
          UIcon: UIconStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Job Match Analysis')
    expect(wrapper.text()).toContain('Alex Rivera')
    expect(wrapper.text()).toContain('Shortlisted')
    expect(wrapper.text()).toContain('Interview Focus')
  })
})
