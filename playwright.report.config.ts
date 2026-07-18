import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import {
  DEFAULT_ACTION_TIMEOUT_MS,
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
  DEFAULT_VIEWPORT,
} from './src/utils/constants';

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
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/report.json' }],
  ],
  outputDir: 'test-results',
  use: {
    baseURL,
    testIdAttribute: 'data-qa',
    headless: true,
    viewport: DEFAULT_VIEWPORT,
    locale: DEFAULT_LOCALE,
    timezoneId: DEFAULT_TIMEZONE,
    colorScheme: 'light',
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: DEFAULT_ACTION_TIMEOUT_MS,
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
