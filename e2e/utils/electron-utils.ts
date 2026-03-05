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
  electronApp: [async ({}, use) => {
    const electronApp = await startElectronApp();
    await use(electronApp);

    // electronApp.close() can hang if the backend server doesn't exit cleanly.
    // Race it against a timeout and force-kill the process as a fallback.
    await Promise.race([
      electronApp.close(),
      new Promise<void>(resolve => setTimeout(resolve, 5000)),
    ]);

    try {
      const proc = electronApp.process();
      if (proc && !proc.killed) {
        proc.kill('SIGKILL');
        // Wait for the OS process to fully exit. Once it does, the CDP WebSocket
        // gets a close event and Playwright drains its internal state — without
        // this wait the dangling close() promise keeps the event loop alive and
        // causes a "Worker teardown timeout" even though all tests passed.
        await new Promise<void>(resolve => {
          if (proc.exitCode !== null) resolve();
          else proc.once('exit', resolve);
        });
      }
    } catch {
      // process() throws if the app already exited cleanly — nothing to do
    }
  }, { timeout: 30000 }],

mainWindow: async ({ electronApp }, use) => {
  const mainWindow = await electronApp.firstWindow();
  await mainWindow.waitForLoadState('domcontentloaded');

  // Debug logging
  console.log('Frames:', mainWindow.frames().map(f => f.url()));
  const webviews = await mainWindow.$$('webview');
  console.log('Webview count:', webviews.length);

  // Comment this out temporarily so it doesn't timeout before you see the logs
  // await mainWindow.waitForSelector('[data-testid="import-site"]', { timeout: 30000 });
  
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
        console.log('Backend is ready!');
        return;
      }
    } catch {
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
      process.cwd(),
      '--test-mode',
    ],
    env: {
      ...process.env,
      NODE_ENV: 'production',
      QUIQR_TEST_MODE: 'true',
    },
  });

  await electronApp.evaluate(async ({ app }: { app: any }) => {
    return app.whenReady();
  });

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
   * Import a site from a local folder.
   *
   * Mocks the native folder picker dialog via Playwright route interception so
   * the test can supply the path without user interaction.
   */
  async importSite(sitePath: string, siteName?: string) {
    // Intercept the folder-picker API call and return our test path
    await this.page.route('**/api/showOpenFolderDialog', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ selectedFolder: sitePath }),
      });
    });

    // Open import dialog
    await this.page.click('[data-testid="import-site"]');

    // Step 0: select "FROM FOLDER" source type (auto-advances to step 1)
    await this.page.click('[data-testid="source-type-folder"]');

    // Step 1: trigger the (mocked) folder picker
    await this.page.click('[data-testid="pick-folder-button"]');

    // Wait for the dialog to validate the folder and populate the site name
    await this.page.waitForTimeout(1500);

    // Override the site name if provided
    if (siteName) {
      await this.page.fill('[data-testid="site-name-input"]', siteName);
    }

    // Confirm the import
    await this.page.click('[data-testid="confirm-import"]');

    // Wait for the success step
    await expect(this.page.locator('[data-testid="import-success"]')).toBeVisible({
      timeout: 15000,
    });

    // Close the dialog so the site library is accessible
    await this.page.click('[data-testid="close-dialog-button"]');

    // Clean up route mock
    await this.page.unroute('**/api/showOpenFolderDialog');
  }

  /**
   * Open a site from the library by its key.
   * Uses the id="list-siteselectable-{key}" attribute on SiteListItem/CardItem.
   */
  async openSite(siteName: string) {
    await this.page.click(`#list-siteselectable-${siteName}`);
    await expect(this.page.locator('[data-testid="workspace-header"]')).toBeVisible({
      timeout: 10000,
    });
  }

  /**
   * Navigate to the content section via the toolbar button.
   */
  async navigateToContent() {
    await this.page.click('[data-testid="content-tab"]');
  }

  /**
   * Click a sidebar item by its label (case-insensitive, spaces become dashes).
   * E.g. label "Posts" → data-testid="sidebar-item-posts"
   */
  async clickSidebarItem(label: string) {
    const testId = `sidebar-item-${label.toLowerCase().replace(/\s+/g, '-')}`;
    await this.page.click(`[data-testid="${testId}"]`);
  }

  /**
   * Trigger a folder-sync build.
   * Requires the workspace to have a folder sync configured.
   */
  async buildSite() {
    await this.page.click('[data-testid="sync-tab"]');
    await this.page.click('[data-testid="start-build"]');
    // Wait for the loading spinner to disappear
    await this.page.waitForSelector('[data-testid="loading-spinner"]', {
      state: 'hidden',
      timeout: 60000,
    });
  }

  /**
   * Click the "New content" button to create a new collection item.
   */
  async clickNewContent() {
    await this.page.click('[data-testid="new-content"]');
  }

  /**
   * Wait for loading to complete.
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
