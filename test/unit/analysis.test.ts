import { describe, expect, it } from 'vitest'
import { buildAnalysisPrompt } from '../../server/utils/analysis/prompt'
import {
  normalizeAnalysisResults,
  normalizeEnum,
  normalizeEvaluationAreas,
  normalizeScore,
  normalizeStringArray,
} from '../../server/utils/analysis/normalize'

describe('analysis normalization', () => {
  it('clamps numeric scores into the supported range', () => {
    expect(normalizeScore(120)).toBe(100)
    expect(normalizeScore(-10)).toBe(0)
    expect(normalizeScore('42')).toBe(42)
  })

  it('normalizes enums safely', () => {
    expect(normalizeEnum('Expert', ['Expert', 'Advanced'] as const, 'Advanced')).toBe('Expert')
    expect(normalizeEnum('Unknown', ['Expert', 'Advanced'] as const, 'Advanced')).toBe('Advanced')
  })

  it('strips non-string entries from arrays', () => {
    expect(normalizeStringArray(['a', 1, null, 'b'])).toEqual(['a', 'b'])
  })

  it('normalizes malformed analysis payloads with safe fallbacks', () => {
    const normalized = normalizeAnalysisResults({
      candidate: {
        name: 'Alex Rivera',
        experience_years: 150,
      },
      match: {
        score: '85',
        label: 'Unknown',
      },
      evaluation_areas: [
        {
          category: 'Leadership',
          items: ['Mentoring', 4],
          level: 'Advanced',
          score: '70',
        },
      ],
      assessment: {
        strengths: ['Strong portfolio', 4],
      },
      signals: [
        {
          label: 'Signal',
          value: 9,
          score: '103',
        },
      ],
      interview_focus: ['Clarify scope', false],
    })

    expect(normalized.candidate.current_title).toBe('Title not clearly demonstrated')
    expect(normalized.candidate.experience_years).toBe(100)
    expect(normalized.match.label).toBe('Weak Fit')
    expect(normalized.evaluation_areas[0]).toMatchObject({
      category: 'Leadership',
      items: ['Mentoring'],
      level: 'Advanced',
      score: 70,
      evidence: 'Insufficient evidence.',
    })
    expect(normalized.assessment.strengths).toEqual(['Strong portfolio'])
    expect(normalized.signals[0]).toEqual({
      label: 'Signal',
      value: 'Not clearly demonstrated',
      score: 100,
    })
    expect(normalized.interview_focus).toEqual(['Clarify scope'])
  })

  it('normalizes evaluation areas independently', () => {
    expect(normalizeEvaluationAreas([{ level: 'Limited', score: 20 }])[0]).toMatchObject({
      category: 'Evaluation Area',
      items: [],
      level: 'Limited',
      score: 20,
      evidence: 'Insufficient evidence.',
    })
  })
})

describe('analysis prompt builder', () => {
  it('includes recruiter input and role-agnostic instructions', () => {
    const prompt = buildAnalysisPrompt('Senior product designer with design systems experience')

    expect(prompt).toContain('Recruiter input: Senior product designer with design systems experience')
    expect(prompt).toContain('must not hardcode role-specific logic')
    expect(prompt).toContain('Populate every required field in the schema because missing fields break the UI.')
    expect(prompt).toContain('signals should contain 3 concise dashboard signals')
  })
})
