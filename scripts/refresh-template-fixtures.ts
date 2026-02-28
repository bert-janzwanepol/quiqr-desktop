/**
 * Refresh Template Fixtures
 *
 * Scans {dataFolder}/sites/ for locally-cloned community templates, loads each
 * template's WorkspaceConfig via WorkspaceConfigProvider, and writes the
 * resolved Field[] for each collection and single to JSON fixture files at:
 *
 *   packages/frontend/test/fixtures/templates/<template-name>/<key>.json
 *
 * These fixtures are gitignored for security. Refresh before releases and when adding new field types.
 *
 * Usage:
 *   npm run refresh-template-fixtures
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { WorkspaceConfigProvider } from '../packages/backend/src/services/workspace/workspace-config-provider.js';
import { FormatProviderResolver } from '../packages/backend/src/utils/format-provider-resolver.js';
import type { UnifiedConfigService } from '../packages/backend/src/config/unified-config-service.js';
import type { EnvironmentInfo } from '../packages/backend/src/utils/path-helper.js';
import { PathHelper } from '../packages/backend/src/utils/path-helper.js';
import { createMockPathHelper } from '../packages/backend/test/mocks/ssg-dependencies.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const FIXTURES_DIR = path.join(PROJECT_ROOT, 'packages', 'frontend', 'test', 'fixtures', 'templates');

// ---------------------------------------------------------------------------
// Template discovery (same logic as backend corpus test)
// ---------------------------------------------------------------------------

interface DiscoveredTemplate {
  name: string;
  workspacePath: string;
}

function discoverTemplates(pathHelper: PathHelper): DiscoveredTemplate[] {
  const sitesDir = path.join(pathHelper.getRoot(), 'sites');
  if (!fs.existsSync(sitesDir)) return [];

  const templates: DiscoveredTemplate[] = [];

  const entries = fs.readdirSync(sitesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const siteName = entry.name;
    const siteDir = path.join(sitesDir, siteName);

    const wsEntries = fs.readdirSync(siteDir, { withFileTypes: true });
    for (const wsEntry of wsEntries) {
      if (!wsEntry.isDirectory()) continue;
      const workspacePath = path.join(siteDir, wsEntry.name);
      const modelBasePath = path.join(workspacePath, 'quiqr', 'model', 'base.yaml');
      if (fs.existsSync(modelBasePath)) {
        templates.push({ name: siteName, workspacePath });
        break;
      }
    }
  }

  return templates;
}

// ---------------------------------------------------------------------------
// Real PathHelper factory for template discovery
// ---------------------------------------------------------------------------

/**
 * Create a real PathHelper that uses actual file system paths (not mocks).
 * Used for discovering templates in the user's actual data folder.
 */
function createRealPathHelper(): PathHelper {
  // Create a minimal real AppInfoAdapter for script use
  const appInfo = {
    getPath: (name: string) => {
      if (name === 'home') {
        return process.env.HOME || process.env.USERPROFILE || '/tmp';
      }
      return '/tmp';
    },
    isPackaged: () => false,
    getAppPath: () => process.cwd(),
    getVersion: () => '0.0.0-script',
  };

  // PathHelper will default to ~/Quiqr when no dataFolder is set
  return new PathHelper(appInfo, process.cwd(), {});
}

// ---------------------------------------------------------------------------
// Provider factory (same stubs as backend corpus test)
// ---------------------------------------------------------------------------

function createProvider(): WorkspaceConfigProvider {
  const formatResolver = new FormatProviderResolver();
  const pathHelper = createMockPathHelper();
  const unifiedConfig = {
    getInstanceSetting: (key: string) => {
      if (key === 'dev.disablePartialCache') return false;
      return undefined;
    },
  } as unknown as UnifiedConfigService;
  const environmentInfo: EnvironmentInfo = {
    platform: process.platform === 'darwin' ? 'macOS' : process.platform === 'win32' ? 'windows' : 'linux',
    isPackaged: false,
  };
  return new WorkspaceConfigProvider(formatResolver, pathHelper, unifiedConfig, environmentInfo);
}

// ---------------------------------------------------------------------------
// Fixture generation
// ---------------------------------------------------------------------------

async function main() {
  // Use real PathHelper to discover actual user templates
  const realPathHelper = createRealPathHelper();
  const templates = discoverTemplates(realPathHelper);

  if (templates.length === 0) {
    console.warn('No templates found — nothing to generate.');
    process.exit(0);
  }

  console.log(`Found ${templates.length} template(s). Generating fixtures to ${FIXTURES_DIR}\n`);

  let generated = 0;
  let skipped = 0;

  for (const template of templates) {
    console.log(`Processing: ${template.name}`);

    const provider = createProvider();

    let config;
    try {
      config = await provider.readOrCreateMinimalModelConfig(template.workspacePath, 'main');
    } catch (err) {
      console.warn(`  SKIP — failed to load config: ${err instanceof Error ? err.message.split('\n')[0] : err}`);
      skipped++;
      continue;
    }

    const templateDir = path.join(FIXTURES_DIR, template.name);
    fs.ensureDirSync(templateDir);

    // Write one fixture file per collection
    for (const collection of config.collections ?? []) {
      const fields = Array.isArray(collection.fields) ? collection.fields : [];
      const fixture = {
        templateName: template.name,
        key: collection.key,
        kind: 'collection' as const,
        fields,
        initialValues: {},
      };
      const outPath = path.join(templateDir, `collection__${collection.key}.json`);
      fs.writeFileSync(outPath, JSON.stringify(fixture, null, 2) + '\n', 'utf8');
      console.log(`  ✓ collection: ${collection.key} (${fields.length} fields)`);
      generated++;
    }

    // Write one fixture file per single
    for (const single of config.singles ?? []) {
      const fields = Array.isArray(single.fields) ? single.fields : [];
      const fixture = {
        templateName: template.name,
        key: single.key,
        kind: 'single' as const,
        fields,
        initialValues: {},
      };
      const outPath = path.join(templateDir, `single__${single.key}.json`);
      fs.writeFileSync(outPath, JSON.stringify(fixture, null, 2) + '\n', 'utf8');
      console.log(`  ✓ single:     ${single.key} (${fields.length} fields)`);
      generated++;
    }

    console.log('');
  }

  console.log(`Done. Generated ${generated} fixture file(s), skipped ${skipped} template(s).`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
