import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright configuration for Quiqr Desktop E2E testing
 *
 * This config is optimized for Electron testing with cross-platform support.
 * Tests run sequentially to prevent port conflicts between multiple Electron instances.
 * Tests focus on critical user workflows as defined in testing-strategy spec.
 */
export default defineConfig({
  testDir: './e2e',

  /* Run tests sequentially to avoid port conflicts with multiple Electron instances */
  fullyParallel: false,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Stop after first failure so globalTeardown always runs before the library
     state gets further corrupted by subsequent tests running against dirty state. */
  bail: 1,

  /* Use single worker to prevent multiple Electron instances from conflicting */
  workers: 1,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers and Electron */
  projects: [
    {
      name: 'electron',
      use: {
        ...devices['Desktop Chrome'], // Use Chrome-like settings as baseline
      },
      testMatch: /.*\.electron\.spec\.ts/,
    },

    /* Cross-platform testing - uncomment when needed */
    // {
    //   name: 'electron-win',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     // Windows-specific settings can go here
    //   },
    //   testMatch: /.*\.electron\.spec\.ts/,
    // },

    // {
    //   name: 'electron-mac',
    //   use: {
    //     ...devices['Desktop Safari'], // More similar to macOS WebView
    //   },
    //   testMatch: /.*\.electron\.spec\.ts/,
    // },
  ],

  /* Global setup and teardown */
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  globalTeardown: require.resolve('./e2e/global-teardown.ts'),

  /* Test timeout */
  timeout: 60000, // 1 minute for E2E tests

  /* Expect timeout for assertions */
  expect: {
    timeout: 10000, // 10 seconds for element assertions
  },
});