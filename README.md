# HireLens

HireLens is a recruiter-facing screening dashboard that compares a candidate resume against recruiter input and returns a structured, evidence-based hiring report.

The app is not a generic CV scorer and it is not a final hiring decision system. It is a decision-support tool for structured screening.

## Core flow

1. A recruiter pastes a job description or recruiter prompt.
2. A recruiter uploads a PDF resume.
3. The server sends the recruiter input plus resume content to Gemini.
4. Gemini returns a strict dashboard-shaped JSON response.
5. The UI renders match score, comparison areas, recruiter assessment, signals, interview focus, shortlist state, and a downloadable PDF report.

## Environment

Create a `.env` file with:

```bash
NUXT_GEMINI_API=your_gemini_api_key
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_PUBLIC_SITE_NAME=HireLens
```

## Development

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Testing

Run all Vitest projects:

```bash
pnpm test
```

Run unit tests only:

```bash
pnpm test:unit
```

Run Nuxt component tests:

```bash
pnpm test:nuxt
```

Run Playwright end-to-end tests:

```bash
pnpm test:e2e
```

## Project notes

- The dashboard response shape is defined in `types/results.ts`.
- The `/api/analyze-cv` endpoint expects multipart fields `cv` and `jobDescription`.
- Shortlist state is stored client-side in `localStorage`.
- PDF export is dependency-free and generates a text-based match report.
