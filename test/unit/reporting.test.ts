// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { analysisResultsFixture } from '../fixtures/analysis-results'
import { buildPdfLines } from '../../app/utils/pdf-report'
import { useShortlist } from '../../app/composables/useShortlist'

const TestShortlist = defineComponent({
  props: {
    candidate: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    return useShortlist(() => props.candidate)
  },
  template: '<div />',
})

describe('shortlist composable', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('loads persisted shortlist state and toggles it', async () => {
    const key = 'hirelens:shortlist:alex rivera|senior product designer|brooklyn, ny (hybrid)'
    localStorage.setItem(key, 'true')

    const wrapper = mount(TestShortlist, {
      props: {
        candidate: analysisResultsFixture.candidate,
      },
    })

    expect(wrapper.vm.isShortlisted).toBe(true)

    wrapper.vm.toggleShortlist()

    expect(wrapper.vm.isShortlisted).toBe(false)
    expect(localStorage.getItem(key)).toBe('false')
  })

  it('changes storage identity when candidate identity changes', async () => {
    const wrapper = mount(TestShortlist, {
      props: {
        candidate: analysisResultsFixture.candidate,
      },
    })

    wrapper.vm.toggleShortlist()

    await wrapper.setProps({
      candidate: {
        ...analysisResultsFixture.candidate,
        name: 'Taylor Kim',
      },
    })

    expect(wrapper.vm.isShortlisted).toBe(false)
  })
})

describe('pdf export builder', () => {
  it('includes shortlist status and key report sections', () => {
    const lines = buildPdfLines(analysisResultsFixture, true)

    expect(lines).toContain('Shortlist Status: Shortlisted')
    expect(lines.some(line => line.includes('Match Score: 92/100'))).toBe(true)
    expect(lines.some(line => line.includes('Evaluation Areas'))).toBe(true)
    expect(lines.some(line => line.includes('Interview Focus'))).toBe(true)
  })

  it('renders non-shortlisted state', () => {
    const lines = buildPdfLines(analysisResultsFixture, false)

    expect(lines).toContain('Shortlist Status: Not Shortlisted')
  })
})
