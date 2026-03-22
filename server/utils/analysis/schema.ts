export const analysisResultsSchema = {
  type: 'object',
  properties: {
    candidate: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        current_title: { type: 'string' },
        location: { type: 'string' },
        experience_years: { type: 'number' },
        availability: { type: 'string' },
      },
      required: ['name', 'current_title', 'location', 'experience_years', 'availability'],
    },
    match: {
      type: 'object',
      properties: {
        score: { type: 'number' },
        label: {
          type: 'string',
          enum: ['Excellent Fit', 'Strong Fit', 'Moderate Fit', 'Weak Fit'],
        },
        summary: { type: 'string' },
      },
      required: ['score', 'label', 'summary'],
    },
    evaluation_areas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          items: {
            type: 'array',
            items: { type: 'string' },
          },
          level: {
            type: 'string',
            enum: ['Expert', 'Advanced', 'Qualified', 'Limited'],
          },
          score: { type: 'number' },
          evidence: { type: 'string' },
        },
        required: ['category', 'items', 'level', 'score', 'evidence'],
      },
    },
    assessment: {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        strengths: {
          type: 'array',
          items: { type: 'string' },
        },
        gaps: {
          type: 'array',
          items: { type: 'string' },
        },
        risks: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['summary', 'strengths', 'gaps', 'risks'],
    },
    signals: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          value: { type: 'string' },
          score: { type: 'number' },
        },
        required: ['label', 'value', 'score'],
      },
    },
    interview_focus: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: [
    'candidate',
    'match',
    'evaluation_areas',
    'assessment',
    'signals',
    'interview_focus',
  ],
} as const
