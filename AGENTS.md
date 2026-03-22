# AGENTS.md

## Project overview

This project is an AI-powered recruiter assistant that evaluates candidates against a job role and produces a structured, evidence-based hiring report.

The system must work for ANY role, including but not limited to:
- Engineering
- Design
- Product
- Sales
- Marketing
- Operations
- Customer support
- Leadership roles

The output must power a recruiter-facing dashboard UI.

This is NOT a generic CV analyzer.
This is a decision-support tool for structured candidate screening.

---

## Core principles

### 1. Evidence-based evaluation ONLY

All outputs must be grounded in:
- recruiter input (job description or prompt)
- parsed resume data

Never invent:
- skills
- experience
- seniority
- achievements

If unclear, use:
- "not clearly demonstrated"
- "insufficient evidence"

---

### 2. Role-agnostic system (CRITICAL)

The system must NOT hardcode role-specific logic such as:
- "Figma"
- "React"
- "Prototyping"

These are examples only.

Instead:
- dynamically infer evaluation criteria from the job input
- adapt output structure to ANY role

---

### 3. UI-driven output (STRICT CONTRACT)

The AI output must strictly follow a structured schema that maps directly to the UI.

Missing fields will break the UI → NOT acceptable.

---

## Required output format (STRICT)

```json
{
  "candidate": {
    "name": "",
    "current_title": "",
    "location": "",
    "experience_years": 0,
    "availability": ""
  },

  "match": {
    "score": 0,
    "label": "Excellent Fit | Strong Fit | Moderate Fit | Weak Fit",
    "summary": ""
  },

  "evaluation_areas": [
    {
      "category": "",
      "items": [],
      "level": "Expert | Advanced | Qualified | Limited",
      "score": 0,
      "evidence": ""
    }
  ],

  "assessment": {
    "summary": "",
    "strengths": [],
    "gaps": [],
    "risks": []
  },

  "signals": [
    {
      "label": "",
      "value": "",
      "score": 0
    }
  ],

  "interview_focus": []
}