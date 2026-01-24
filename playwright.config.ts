import { defineConfig, devices } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env.local') });


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './__tests__/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },


  /* Configure projects for major browsers */
 projects: [
    // --- FIREFOX SETUP & PROJECT ---
    {
      name: 'setup-firefox',
      testMatch: /auth\.setup\.ts/,
      metadata: {
        userEmail: 'test-user-firefox@test.com',
        userKey: process.env.TEST_USER_KEY,
        userName: 'Firefox'
      },
    },
    {
      name: 'firefox',
      workers: 1,
      use: {
        ...devices['Desktop Firefox'],
        storageState: './__tests__/e2e/.auth/firefox.json',
        colorScheme: "light",
      },
      dependencies: ['setup-firefox'],
    },

    // --- WEBKIT SETUP & PROJECT ---
    {
      name: 'setup-webkit',
      testMatch: /auth\.setup\.ts/,
      metadata: {
        userEmail: 'test-user-webkit@test.com',
        userKey: process.env.TEST_USER_KEY,
        userName: 'Webkit'
      },
    },
    {
      name: 'webkit',
      workers: 1,
      use: {
        ...devices['Desktop Safari'],
        storageState: './__tests__/e2e/.auth/webkit.json',
      },
      dependencies: ['setup-webkit'], 
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
