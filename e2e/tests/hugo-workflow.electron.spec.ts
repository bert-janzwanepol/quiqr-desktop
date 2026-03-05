import { test, expect, QuiqrTestActions, PathTestUtils } from '../utils/electron-utils';

/**
 * Hugo Site Workflow E2E Tests
 *
 * Two tests cover the full journey:
 * 1. Import — adds the site to the library (must run first, persists to disk)
 * 2. Workspace workflow — opens the site and exercises content editing in one
 *    continuous session, avoiding repeated Electron startup overhead.
 *
 * The import dialog's native folder picker is mocked via Playwright route
 * interception so tests run without manual file-system interaction.
 */

test.describe('Hugo Site Workflow', () => {
  let actions: QuiqrTestActions;

  test.beforeEach(async ({ mainWindow }) => {
    actions = new QuiqrTestActions(mainWindow);
  });

  test('import Hugo site', async () => {
    const testPaths = PathTestUtils.getTestPaths();

    // importSite mocks the folder picker, validates the success step, and
    // closes the dialog — leaving the site registered in the library on disk.
    await actions.importSite(testPaths.hugoSite);
  });

  test('open workspace, navigate collections, edit and create content', async ({ mainWindow }) => {
    // --- Open site ---
    await actions.openSite('hugo-test-site');
    await expect(mainWindow.locator('[data-testid="workspace-header"]')).toBeVisible();

    // --- Navigate to Posts collection ---
    await actions.navigateToContent();
    await actions.clickSidebarItem('Posts');
    await expect(mainWindow.locator('[data-testid="content-list"]')).toBeVisible();
    await expect(mainWindow.locator('[data-testid="content-list"]')).toContainText('test-post.md');

    // --- Edit the test post ---
    await mainWindow.click('[data-testid="content-list"] >> text=test-post.md');
    // Wait for the title field to finish lazy-loading from the field registry
    await expect(mainWindow.locator('[data-testid="text-field-title"]')).toBeVisible({ timeout: 15000 });
    await mainWindow.fill('[data-testid="text-field-title"]', 'Updated Test Post Title');
    await mainWindow.click('[data-testid="save-content"]');
    await expect(mainWindow.locator('[data-testid="save-status"]')).toBeVisible();

    // --- Create a new post ---
    await actions.clickSidebarItem('Posts');
    const listItems = mainWindow.locator('[data-testid="content-list"] li');
    const countBefore = await listItems.count();
    await actions.clickNewContent();
    await expect(listItems).toHaveCount(countBefore + 1, { timeout: 5000 });
  });
});
