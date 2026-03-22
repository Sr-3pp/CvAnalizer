import type { AnalysisResults } from '~~/types/results'

const MATCH_LABELS: AnalysisResults['match']['label'][] = ['Excellent Fit', 'Strong Fit', 'Moderate Fit', 'Weak Fit']
const EVALUATION_LEVELS: AnalysisResults['evaluation_areas'][number]['level'][] = ['Expert', 'Advanced', 'Qualified', 'Limited']

export const normalizeScore = (value: unknown) => {
  const numericValue = typeof value === 'number' ? value : Number(value)

  if (Number.isNaN(numericValue)) {
    return 0
  }

  return Math.min(100, Math.max(0, Math.round(numericValue)))
}

export const normalizeString = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback

export const normalizeStringArray = (value: unknown) => Array.isArray(value)
  ? value.filter((item): item is string => typeof item === 'string')
  : []

export const normalizeEnum = <T extends string>(value: unknown, allowed: readonly T[], fallback: T) => (
  typeof value === 'string' && allowed.includes(value as T) ? value as T : fallback
)

export const normalizeCandidate = (value: unknown): AnalysisResults['candidate'] => {
  const candidate = (value && typeof value === 'object') ? value as Record<string, unknown> : {}

  return {
    name: normalizeString(candidate.name, 'Candidate'),
    current_title: normalizeString(candidate.current_title, 'Title not clearly demonstrated'),
    location: normalizeString(candidate.location, 'Not clearly demonstrated'),
    experience_years: normalizeScore(candidate.experience_years),
    availability: normalizeString(candidate.availability, 'Not clearly demonstrated'),
  }
}

export const normalizeMatch = (value: unknown): AnalysisResults['match'] => {
  const match = (value && typeof value === 'object') ? value as Record<string, unknown> : {}

  return {
    score: normalizeScore(match.score),
    label: normalizeEnum(match.label, MATCH_LABELS, 'Weak Fit'),
    summary: normalizeString(match.summary),
  }
}

export const normalizeEvaluationAreas = (value: unknown): AnalysisResults['evaluation_areas'] => Array.isArray(value)
  ? value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map(item => ({
      category: normalizeString(item.category, 'Evaluation Area'),
      items: normalizeStringArray(item.items),
      level: normalizeEnum(item.level, EVALUATION_LEVELS, 'Limited'),
      score: normalizeScore(item.score),
      evidence: normalizeString(item.evidence, 'Insufficient evidence.'),
    }))
  : []

export const normalizeAssessment = (value: unknown): AnalysisResults['assessment'] => {
  const assessment = (value && typeof value === 'object') ? value as Record<string, unknown> : {}

  return {
    summary: normalizeString(assessment.summary),
    strengths: normalizeStringArray(assessment.strengths),
    gaps: normalizeStringArray(assessment.gaps),
    risks: normalizeStringArray(assessment.risks),
  }
}

export const normalizeSignals = (value: unknown): AnalysisResults['signals'] => Array.isArray(value)
  ? value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map(item => ({
      label: normalizeString(item.label, 'Signal'),
      value: normalizeString(item.value, 'Not clearly demonstrated'),
      score: normalizeScore(item.score),
    }))
  : []

export const normalizeAnalysisResults = (value: unknown): AnalysisResults => {
  const result = (value && typeof value === 'object') ? value as Record<string, unknown> : {}

  return {
    candidate: normalizeCandidate(result.candidate),
    match: normalizeMatch(result.match),
    evaluation_areas: normalizeEvaluationAreas(result.evaluation_areas),
    assessment: normalizeAssessment(result.assessment),
    signals: normalizeSignals(result.signals),
    interview_focus: normalizeStringArray(result.interview_focus),
  }
}
