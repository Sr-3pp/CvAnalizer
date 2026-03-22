export type AnalysisResults = {
  candidate: {
    name: string
    current_title: string
    location: string
    experience_years: number
    availability: string
  }
  match: {
    score: number
    label: 'Excellent Fit' | 'Strong Fit' | 'Moderate Fit' | 'Weak Fit'
    summary: string
  }
  evaluation_areas: Array<{
    category: string
    items: string[]
    level: 'Expert' | 'Advanced' | 'Qualified' | 'Limited'
    score: number
    evidence: string
  }>
  assessment: {
    summary: string
    strengths: string[]
    gaps: string[]
    risks: string[]
  }
  signals: Array<{
    label: string
    value: string
    score: number
  }>
  interview_focus: string[]
}
