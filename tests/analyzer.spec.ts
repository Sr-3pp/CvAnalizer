import { expect, test } from '@nuxt/test-utils/playwright'
import { analysisResultsFixture } from '../test/fixtures/analysis-results'

test('recruiter can analyze, shortlist, and download a report', async ({ page, goto }) => {
  await page.route('**/api/analyze-cv', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(analysisResultsFixture),
    })
  })

  await goto('/', { waitUntil: 'hydration' })

  await page.getByRole('textbox').fill('Senior product designer with strong systems thinking and cross-functional leadership.')
  await page.locator('input[type="file"]').setInputFiles('/Users/sr3pp/Web/Nuxt/CvAnalizer/tests/fixtures/resume.pdf')
  await page.getByRole('button', { name: 'Run Screening Analysis' }).click()

  await expect(page.getByText('Job Match Analysis')).toBeVisible()
  await expect(page.getByText('Alex Rivera', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Shortlist Candidate' }).click()
  await expect(page.getByRole('button', { name: 'Shortlisted' })).toBeVisible()

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download Match Report' }).click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toContain('shortlisted-match-report.pdf')
})
