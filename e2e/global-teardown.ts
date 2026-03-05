import { FullConfig } from '@playwright/test';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

/**
 * Global teardown for Playwright Electron testing
 *
 * Cleans up after E2E tests:
 * - Removes test sites imported into the Quiqr library (so checkFreeSiteName
 *   returns true on the next run)
 * - Cleans up temporary test fixture data
 */

// Site keys created by E2E tests — must match the folder names used in tests
const TEST_SITE_KEYS = ['hugo-test-site', 'jekyll-test-site'];

async function globalTeardown(_config: FullConfig) {
  console.log('Cleaning up E2E tests...');

  const quiqrSitesDir = path.join(os.homedir(), 'Quiqr', 'sites');
  const testDataDir = path.join(process.cwd(), 'e2e', 'test-data');

  // Run all cleanup steps concurrently; collect results so every step runs
  // even if an earlier one fails.
  const results = await Promise.allSettled([
    // Remove test sites from the Quiqr library so checkFreeSiteName returns
    // true on the next run.
    ...TEST_SITE_KEYS.map(siteKey =>
      fs.rm(path.join(quiqrSitesDir, siteKey), { recursive: true, force: true })
        .then(() => console.log(`Removed test site from library: ${siteKey}`))
    ),
    // Remove generated fixture data.
    fs.rm(testDataDir, { recursive: true, force: true })
      .then(() => console.log('Cleaned up test fixture data')),
  ]);

  for (const result of results) {
    if (result.status === 'rejected') {
      console.warn('Teardown step failed (non-fatal):', result.reason);
    }
  }

  console.log('E2E teardown complete');
}

export default globalTeardown;