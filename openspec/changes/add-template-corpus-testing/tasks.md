# Tasks: Add Template Corpus Testing

**Change ID:** `add-template-corpus-testing`

## 1. Investigate WorkspaceConfigProvider constructor requirements

- [ ] 1.1 Read `WorkspaceConfigProvider` constructor signature and identify required DI dependencies
- [ ] 1.2 Determine minimum stubs needed to instantiate it in a test (path helper, no UnifiedConfigService needed?)
- [ ] 1.3 Check an existing backend test (e.g. `ssg-providers/__tests__/integration.test.ts`) for patterns on constructing backend services in tests

## 2. Backend corpus test

- [ ] 2.1 Create `packages/backend/src/services/workspace/__tests__/template-corpus.test.ts`
- [ ] 2.2 Implement template discovery: scan `~/Quiqr/sites/` for subdirs containing `quiqr/model/base.yaml` using `os.homedir()` + `fs.existsSync`
- [ ] 2.3 Hardcode the list of 9 official community template names (from `templates.json`) in the test file
- [ ] 2.4 After discovery, cross-reference found templates against the official list and log each missing template name
- [ ] 2.5 Skip (not fail) missing templates; log a warning when zero templates are discovered
- [ ] 2.6 For each discovered template, call `WorkspaceConfigProvider.getWorkspaceConfig()` with its model directory
- [ ] 2.7 Assert the returned config satisfies `workspaceConfigSchema` (Zod `safeParse`, no errors)
- [ ] 2.8 Extract all `type` values from the resolved `Field[]` tree (collections + singles, recursive)
- [ ] 2.9 Assert each type is in the known-types list (import registered types from `@quiqr/types` or derive from `FieldRegistry` exports if accessible from backend)
- [ ] 2.10 Produce a named failure per unknown type: `"Template <name>: unknown field type '<type>' at path <path>"`
- [ ] 2.11 Verify: `npm run test -w @quiqr/backend` passes with locally-available templates

## 3. Fixture refresh script

- [ ] 3.1 Create `scripts/refresh-template-fixtures.ts`
- [ ] 3.2 Scan `~/Quiqr/sites/` for templates (same logic as backend corpus test)
- [ ] 3.3 For each template, load `WorkspaceConfig` via `WorkspaceConfigProvider`
- [ ] 3.4 Write resolved `Field[]` per collection/single as JSON files to `packages/frontend/test/fixtures/templates/<template-name>/<collection-or-single-key>.json`
- [ ] 3.5 Ensure output is deterministic (stable JSON serialisation, no timestamps)
- [ ] 3.6 Add `"refresh-template-fixtures": "tsx scripts/refresh-template-fixtures.ts"` to root `package.json` scripts
- [ ] 3.7 Run the script with locally-available templates and commit the generated fixture files

## 4. Frontend smoke tests

- [ ] 4.1 Create `packages/frontend/test/components/SukohForm/template-corpus-smoke.test.tsx`
- [ ] 4.2 Use `import.meta.glob` to load all fixture JSON files from `../fixtures/templates/**/*.json`
- [ ] 4.3 For each fixture, render `<FormProvider fields={fixture.fields} initialValues={fixture.initialValues} meta={testMeta} onSave={vi.fn()} />` inside a `MemoryRouter`
- [ ] 4.4 Assert the component mounts without throwing (use `screen.getByRole` or simply assert no error boundary was triggered)
- [ ] 4.5 Skip (not fail) when no fixture files are found, with a note to run `npm run refresh-template-fixtures`
- [ ] 4.6 Verify: `npm run test -w @quiqr/frontend` passes

## 5. Document the testing standard

- [ ] 5.1 Add a `## Corpus Testing` section to `AGENTS.md` that describes the three-layer testing approach and when corpus tests must be run
- [ ] 5.2 Note that changes touching `WorkspaceConfigProvider`, `WorkspaceConfigValidator`, `FieldRegistry`, or field types MUST include a corpus test run as part of their task checklist
- [ ] 5.3 Note the `npm run refresh-template-fixtures` script and when to use it (before releases, when adding new field types)

## 6. Verify end-to-end

- [ ] 6.1 Run `npm run refresh-template-fixtures` — confirm fixture files generated for all locally-cloned templates
- [ ] 6.2 Run `npm run test -w @quiqr/backend` — confirm corpus tests pass
- [ ] 6.3 Run `npm run test -w @quiqr/frontend` — confirm smoke tests pass
- [ ] 6.4 Deliberately introduce a bad field type in a fixture file, confirm the backend corpus test produces a named failure, then revert
