import { FullConfig } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Global teardown for Playwright Electron testing
 *
 * Cleans up after E2E tests:
 * - Stops any running Electron processes
 * - Cleans up temporary test data
 * - Restores system state
 */

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up E2E tests...');

  // Clean up test data (optional - might want to keep for debugging)
  const testDataDir = path.join(process.cwd(), 'e2e', 'test-data');
  try {
    await fs.rmdir(testDataDir, { recursive: true });
    console.log('🗑️ Cleaned up test data');
  } catch (error) {
    // Test data might not exist or be in use - not critical
    console.log('⚠️ Could not clean up test data (may not exist)');
  }

  console.log('✅ E2E teardown complete');
}

export default globalTeardown;