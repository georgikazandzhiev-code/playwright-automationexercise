import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL ?? 'https://www.automationexercise.com';

export default defineConfig({
  testDir: './src/tests',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',
  use: {
    baseURL,
    testIdAttribute: 'data-qa',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Headed locally (see browser); GitHub Actions sets CI=true → headless there.
    headless: !!process.env.CI,
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
