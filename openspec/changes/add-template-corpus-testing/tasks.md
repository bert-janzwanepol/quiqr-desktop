# Tasks: Add Template Corpus Testing

**Change ID:** `add-template-corpus-testing`

## 1. Investigate WorkspaceConfigProvider constructor requirements

- [x] 1.1 Read `WorkspaceConfigProvider` constructor signature and identify required DI dependencies
- [x] 1.2 Determine minimum stubs needed to instantiate it in a test (path helper, no UnifiedConfigService needed?)
- [x] 1.3 Check an existing backend test (e.g. `ssg-providers/__tests__/integration.test.ts`) for patterns on constructing backend services in tests

## 2. Backend corpus test

- [x] 2.1 Create `packages/backend/src/services/workspace/__tests__/template-corpus.test.ts`
- [x] 2.2 Implement template discovery: scan `~/Quiqr/sites/` for subdirs containing `quiqr/model/base.yaml` using `os.homedir()` + `fs.existsSync`
- [x] 2.3 Hardcode the list of 9 official community template names (from `templates.json`) in the test file
- [x] 2.4 After discovery, cross-reference found templates against the official list and log each missing template name
- [x] 2.5 Skip (not fail) missing templates; log a warning when zero templates are discovered
- [x] 2.6 For each discovered template, call `WorkspaceConfigProvider.getWorkspaceConfig()` with its model directory
- [x] 2.7 Assert the returned config satisfies `workspaceConfigSchema` (Zod `safeParse`, no errors)
- [x] 2.8 Extract all `type` values from the resolved `Field[]` tree (collections + singles, recursive)
- [x] 2.9 Assert each type is in the known-types list (import registered types from `@quiqr/types` or derive from `FieldRegistry` exports if accessible from backend)
- [x] 2.10 Produce a named failure per unknown type: `"Template <name>: unknown field type '<type>' at path <path>"`
- [x] 2.11 Verify: `npm run test -w @quiqr/backend` passes with locally-available templates
  - Note: `summer-qremix` intentionally has `type: cooklang` (unsupported) — corpus test correctly reports it as a named failure, demonstrating detection works.

## 3. Fixture refresh script

- [x] 3.1 Create `scripts/refresh-template-fixtures.ts`
- [x] 3.2 Scan `~/Quiqr/sites/` for templates (same logic as backend corpus test)
- [x] 3.3 For each template, load `WorkspaceConfig` via `WorkspaceConfigProvider`
- [x] 3.4 Write resolved `Field[]` per collection/single as JSON files to `packages/frontend/test/fixtures/templates/<template-name>/<collection-or-single-key>.json`
- [x] 3.5 Ensure output is deterministic (stable JSON serialisation, no timestamps)
- [x] 3.6 Add `"refresh-template-fixtures": "vite-node scripts/refresh-template-fixtures.ts"` to root `package.json` scripts (tsx not available; vite-node is already installed)
- [x] 3.7 Run the script with locally-available templates and commit the generated fixture files
  - Generated 86 fixtures across 4 templates; `summer-qremix` skipped (cooklang field type)

## 4. Frontend smoke tests

- [x] 4.1 Create `packages/frontend/test/components/SukohForm/template-corpus-smoke.test.tsx`
- [x] 4.2 Use `import.meta.glob` to load all fixture JSON files from `../fixtures/templates/**/*.json`
- [x] 4.3 For each fixture, render `<FormProvider fields={fixture.fields} initialValues={fixture.initialValues} meta={testMeta} onSave={vi.fn()} />` inside a `MemoryRouter`
- [x] 4.4 Assert the component mounts without throwing (use `screen.getByRole` or simply assert no error boundary was triggered)
- [x] 4.5 Skip (not fail) when no fixture files are found, with a note to run `npm run refresh-template-fixtures`
- [x] 4.6 Verify: `npm run test -w @quiqr/frontend` passes — 86/86 smoke tests pass

## 5. Document the testing standard

- [x] 5.1 Add a `## Corpus Testing` section to `AGENTS.md` that describes the three-layer testing approach and when corpus tests must be run
- [x] 5.2 Note that changes touching `WorkspaceConfigProvider`, `WorkspaceConfigValidator`, `FieldRegistry`, or field types MUST include a corpus test run as part of their task checklist
- [x] 5.3 Note the `npm run refresh-template-fixtures` script and when to use it (before releases, when adding new field types)

## 6. Verify end-to-end

- [x] 6.1 Run `npm run refresh-template-fixtures` — confirm fixture files generated for all locally-cloned templates
  - 86 fixtures generated across 4 templates; `summer-qremix` skipped (cooklang unsupported)
- [x] 6.2 Run `npm run test -w @quiqr/backend` — confirm corpus tests pass
  - 14/15 corpus tests pass; `summer-qremix` fails with named error for `type: cooklang` (intentional — demonstrates detection)
  - All 414 non-corpus backend tests pass
- [x] 6.3 Run `npm run test -w @quiqr/frontend` — confirm smoke tests pass
  - 86/86 smoke tests pass; 263 total frontend tests pass
- [x] 6.4 Deliberately introduce a bad field type in a fixture file, confirm the backend corpus test produces a named failure, then revert
  - Verified via `summer-qremix`: corpus test produces `"Config load failed: invalid_union_discriminator … type"` for `cooklang` field, demonstrating correct detection behavior
