import type { AnalysisResults } from '~~/types/results'

export const analysisResultsFixture: AnalysisResults = {
  candidate: {
    name: 'Alex Rivera',
    current_title: 'Senior Product Designer',
    location: 'Brooklyn, NY (Hybrid)',
    experience_years: 9,
    availability: 'Immediate',
  },
  match: {
    score: 92,
    label: 'Excellent Fit',
    summary: 'A high-fidelity evaluation of Alex Rivera against the role requirements. The candidate demonstrates strong evidence across product design, collaboration, and leadership criteria.',
  },
  evaluation_areas: [
    {
      category: 'Technical Proficiency',
      items: ['Figma', 'Design systems', 'Prototyping'],
      level: 'Expert',
      score: 94,
      evidence: 'The resume shows deep hands-on ownership of design systems, prototyping, and cross-functional delivery.',
    },
    {
      category: 'Product Strategy',
      items: ['Discovery', 'Roadmaps'],
      level: 'Advanced',
      score: 88,
      evidence: 'The candidate has led discovery work and partnered with product managers on roadmap shaping.',
    },
    {
      category: 'Leadership Experience',
      items: ['Mentoring', 'Cross-functional leadership'],
      level: 'Qualified',
      score: 82,
      evidence: 'The resume includes mentoring and squad leadership, though team size and scope are not fully detailed.',
    },
  ],
  assessment: {
    summary: 'Alex Rivera represents a strong architectural candidate for this role. The profile aligns well with the recruiter input, with only a few areas that need validation in interview.',
    strengths: [
      'Strong portfolio and hands-on design system experience.',
      'Clear evidence of cross-functional collaboration with product and engineering.',
    ],
    gaps: [
      'Enterprise B2B depth is not clearly demonstrated.',
    ],
    risks: [
      'Team management scope needs validation.',
    ],
  },
  signals: [
    {
      label: 'Cognitive Fit',
      value: 'High - Problem Solver',
      score: 91,
    },
    {
      label: 'Team Synergy',
      value: '88% Cultural Match',
      score: 88,
    },
    {
      label: 'Growth Potential',
      value: 'Fast-Track Lead',
      score: 86,
    },
  ],
  interview_focus: [
    'Validate depth of B2B enterprise experience.',
    'Clarify leadership scope and hiring responsibilities.',
    'Probe product strategy influence beyond execution.',
  ],
}
