import { test as base, expect, ElectronApplication, Page } from '@playwright/test';
import path from 'path';

/**
 * Electron testing utilities for Quiqr Desktop
 *
 * Provides helpers for:
 * - Starting/stopping Electron app
 * - Common test actions
 * - Cross-platform path handling
 */

export interface ElectronFixtures {
  electronApp: ElectronApplication;
  mainWindow: Page;
}

// Extended test with Electron fixtures
export const test = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => {
    // Start Electron app
    const electronApp = await startElectronApp();
    await use(electronApp);
    await electronApp.close();
  },

  mainWindow: async ({ electronApp }, use) => {
    // Get the main window
    const mainWindow = await electronApp.firstWindow();
    await use(mainWindow);
  },
});

export { expect } from '@playwright/test';

/**
 * Wait for backend server to be ready
 */
async function waitForBackend(url: string, maxWaitTime = 30000): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        // 404 is fine - means server is running but no route handler
        console.log('Backend is ready!');
        return;
      }
    } catch (error) {
      // Server not ready yet, continue polling
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error(`Backend not ready after ${maxWaitTime}ms`);
}

/**
 * Start the Electron application for testing
 */
async function startElectronApp(): Promise<ElectronApplication> {
  const { _electron } = require('@playwright/test');

  const electronApp = await _electron.launch({
    args: [
      process.cwd(), // Point at project root so app.getAppPath() returns the correct path
      '--test-mode', // Add test mode flag
    ],
    env: {
      ...process.env,
      NODE_ENV: 'production', // Use production mode for realistic testing (serves frontend)
      QUIQR_TEST_MODE: 'true',
    },
  });

  // Wait for app to be ready
  await electronApp.evaluate(async ({ app }: { app: any }) => {
    return app.whenReady();
  });

  // Wait for backend to be ready by polling localhost:5150
  console.log('Waiting for backend to be ready on port 5150...');
  await waitForBackend('http://localhost:5150');

  return electronApp;
}

/**
 * Common test actions for Quiqr Desktop
 */
export class QuiqrTestActions {
  constructor(private page: Page) {}

  /**
   * Import a test site
   */
  async importSite(sitePath: string, expectedProvider?: string) {
    await this.page.click('[data-testid="import-site"]');
    await this.page.fill('[data-testid="site-path"]', sitePath);
    await this.page.click('[data-testid="confirm-import"]');

    if (expectedProvider) {
      await expect(this.page.locator('[data-testid="provider-type"]')).toHaveText(expectedProvider);
    }

    // Wait for import to complete
    await expect(this.page.locator('[data-testid="import-success"]')).toBeVisible();
  }

  /**
   * Navigate to a workspace
   */
  async navigateToWorkspace(workspaceKey: string = 'main') {
    await this.page.click(`[data-testid="workspace-${workspaceKey}"]`);
    await expect(this.page.locator('[data-testid="workspace-header"]')).toBeVisible();
  }

  /**
   * Create new content
   */
  async createContent(filename: string, content: string) {
    await this.page.click('[data-testid="new-content"]');
    await this.page.fill('[data-testid="content-filename"]', filename);
    await this.page.fill('[data-testid="content-editor"]', content);
    await this.page.click('[data-testid="save-content"]');

    // Wait for save confirmation
    await expect(this.page.locator('[data-testid="save-status"]')).toHaveText('Saved');
  }

  /**
   * Build the site
   */
  async buildSite() {
    await this.page.click('[data-testid="build-tab"]');
    await this.page.click('[data-testid="start-build"]');

    // Wait for build to complete (up to 30 seconds)
    await expect(this.page.locator('[data-testid="build-status"]')).toHaveText('Build completed', {
      timeout: 30000,
    });
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator('[data-testid="loading-spinner"]')).toBeHidden();
  }
}

/**
 * Cross-platform path utilities for tests
 */
export class PathTestUtils {
  /**
   * Get platform-appropriate test paths
   */
  static getTestPaths() {
    const testDataDir = path.join(process.cwd(), 'e2e', 'test-data');

    return {
      hugoSite: path.join(testDataDir, 'hugo-test-site'),
      jekyllSite: path.join(testDataDir, 'jekyll-test-site'),
      tempDir: path.join(testDataDir, 'temp'),
    };
  }

  /**
   * Normalize path for current platform
   */
  static normalizePath(inputPath: string): string {
    return path.resolve(inputPath);
  }

  /**
   * Get platform-specific path separators for testing
   */
  static getPathSeparators() {
    return {
      current: path.sep,
      windows: '\\',
      posix: '/',
    };
  }
}