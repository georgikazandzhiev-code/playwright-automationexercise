import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL ?? 'https://www.automationexercise.com';

/** Full suite with HTML + JSON artifacts for management / audit (`npm run test:report`). */
export default defineConfig({
  testDir: './src/tests',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/report.json' }],
  ],
  outputDir: 'test-results',
  use: {
    baseURL,
    testIdAttribute: 'data-qa',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    headless: !!process.env.CI,
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
  },
  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: {
        baseURL,
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'chromium',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
