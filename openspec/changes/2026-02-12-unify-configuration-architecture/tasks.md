# Tasks: Unify Configuration Architecture

**Change ID:** `unify-configuration-architecture`

## Implementation Checklist

### Phase 1: Schema Foundation
> Define the data structures that underpin the new configuration system

- [x] **T1.1** Define `instanceSettingsSchema` in `@quiqr/types` with storage, defaults, forced prefs
- [x] **T1.2** Define `userPreferencesSchema` for all user-configurable settings (already existed, extended)
- [x] **T1.3** ~~Define `groupConfigSchema` for group-level preferences~~ (OUT OF SCOPE per design.md)
- [x] **T1.4** Define `instanceConfigSchema` combining settings (renamed to `instanceSettingsSchema`)
- [x] **T1.5** Define `userConfigSchema` for per-user config files
- [x] **T1.6** Add environment variable mapping schema (QUIQR_* patterns) - `envVarMappingSchema`, `standardEnvMappings`
- [x] **T1.7** Write unit tests for schema validation edge cases - `config-schemas.test.ts` (23 tests)

### Phase 2: Config Services
> Build the core configuration resolution logic

- [x] **T2.1** Create `ConfigStore` class for loading/saving JSON config files - `packages/backend/src/config/config-store.ts`
- [x] **T2.2** Create `EnvOverrideLayer` for environment variable resolution - `packages/backend/src/config/env-override-layer.ts`
- [x] **T2.3** Create `ConfigResolver` implementing 4-layer precedence algorithm - `packages/backend/src/config/config-resolver.ts`
- [x] **T2.4** Create `UnifiedConfigService` orchestrating store + resolver + env - `packages/backend/src/config/unified-config-service.ts`
- [x] **T2.5** Write unit tests for layered resolution scenarios - `config-resolver.test.ts` (14 tests)
- [x] **T2.6** Write unit tests for environment variable override - `env-override-layer.test.ts` (42 tests)
- [x] **T2.7** Integrate `UnifiedConfigService` into DI container - `packages/backend/src/config/container.ts`

### Phase 3: ~~Migration System~~ (REMOVED - No migration needed)
> **DECISION:** No migration will be implemented. Relying on hardcoded defaults instead.
>
> Rationale: Minimal existing settings + comprehensive defaults = migration not justified

### Phase 4: API Integration
> Expose unified config through backend API

- [x] **T4.1** Update `config-handlers.ts` to use `UnifiedConfigService`
- [x] **T4.2** Add `getEffectivePreference(key, userId?)` endpoint
- [x] **T4.3** Add `setUserPreference(key, value, userId?)` endpoint
- [x] **T4.4** Add `getInstanceSetting(path)` endpoint
- [x] **T4.5** Update `readConfKey` for backward compatibility (legacy handlers preserved)
- [x] **T4.6** Update `saveConfPrefKey` for backward compatibility (legacy handlers preserved)
- [x] **T4.7** Add API tests for new endpoints - `config-handlers.test.ts` (29 tests)

### Phase 5: Frontend Updates
> Update frontend to use new configuration APIs

- [x] **T5.1** Update `api.ts` with new typed config methods
- [x] **T5.2** Update API schemas in `@quiqr/types/src/schemas/api.ts` for new config endpoints
- [x] **T5.3** Update Preferences UI to use new API methods (optional - legacy API still works)
- [x] **T5.4** Test single-user mode works without code changes (backward compatible)
- [x] **T5.5** Document API changes in JSDoc comments (inline in api.ts)

### Phase 6: Documentation & Validation
> Ensure the system is properly documented and tested

- [x] **T6.1** Update `packages/docs/` with configuration guide - Updated `configuration/index.md` to remove migration references
- [x] **T6.2** Document environment variable mapping - `docs/configuration/environment-variables.md` exists
- [x] ~~**T6.3** Document migration process~~ (REMOVED - migration.md deleted)
- [x] **T6.4** Integration test: fresh install → configure → restart - `fresh-install.test.ts` exists (9 tests)
- [x] ~~**T6.5** Integration test: legacy migration~~ (REMOVED - test file deleted)
- [x] **T6.6** Update `AGENTS.md` configuration section - Unified Configuration System section exists

---

## Implementation Summary

### Files Created ✅

| File | Description | Status |
|------|-------------|--------|
| `packages/types/src/schemas/config.ts` | Extended with `instanceSettingsSchema`, `userConfigSchema`, `siteSettingsSchema`, env mappings | ✅ Created |
| `packages/types/src/schemas/api.ts` | Extended with unified config API schemas | ✅ Extended |
| `packages/backend/src/config/config-store.ts` | File-based config persistence (instance, user, site) | ✅ Created |
| `packages/backend/src/config/env-override-layer.ts` | Environment variable override handling | ✅ Created |
| `packages/backend/src/config/config-resolver.ts` | 4-layer precedence resolution | ✅ Created |
| `packages/backend/src/config/unified-config-service.ts` | High-level config API | ✅ Created |

### Files Modified ✅

| File | Changes | Status |
|------|---------|--------|
| `packages/backend/src/config/container.ts` | Added `unifiedConfig` service (removed migration startup logic) | ✅ Updated |
| `packages/backend/src/config/index.ts` | Exported new modules (removed config-migrator export) | ✅ Updated |
| `packages/backend/src/api/handlers/config-handlers.ts` | Added new unified config handlers | ✅ Updated |
| `packages/frontend/src/api.ts` | Added new frontend API methods | ✅ Updated |
| `packages/docs/docs/configuration/index.md` | Removed migration references | ✅ Updated |

### Files Deleted ✅

| File | Reason |
|------|--------|
| `packages/backend/src/config/config-migrator.ts` | Migration no longer needed |
| `packages/backend/src/config/__tests__/config-migrator.test.ts` | Migration tests no longer needed (31 tests removed) |
| `packages/backend/src/config/__tests__/integration/legacy-migration.test.ts` | Migration integration tests no longer needed (16 tests removed) |
| `packages/docs/docs/configuration/migration.md` | Migration documentation no longer needed |

### Architecture to Implement

- **4-layer resolution**: App Defaults → Instance Defaults → User Preferences → Instance Forced
- **File storage**: `~/.config/quiqr/` with `instance_settings.json`, `user_prefs_[user].json`, `site_settings_[sitekey].json`
- **Environment override**: `QUIQR_*` env vars override file config
- ~~**Migration**~~: No migration - fresh start with hardcoded defaults
- **Backward compatibility**: Legacy `readConfKey`/`saveConfPrefKey` API can be updated or deprecated

---

## Dependencies

| Task | Depends On |
|------|------------|
| T2.* | T1.* (schemas must exist first) |
| T4.* | T2.* (API wraps service) |
| T5.* | T4.* (frontend uses API) |
| T6.* | All phases complete |

## Parallelizable Work

- **T1.1-T1.6** can be done in parallel (schema definitions)
- **T2.1-T2.3** can be done in parallel (independent classes)
- **T4.2-T4.6** can be done in parallel (API endpoints)
- **T5.1-T5.3** can be done in parallel (frontend updates)

## Validation Checkpoints ✅

1. After Phase 1: `npm run build -w @quiqr/types` succeeds ✅
2. After Phase 2: Unit tests for config resolution pass ✅ (56 tests total: 14 resolver + 42 env-override)
3. ~~After Phase 3: Migration tests~~ (REMOVED - 47 migration tests deleted)
4. After Phase 4: API integration tests pass ✅ (29 tests)
5. After Phase 5: `npm run dev` works with new config ✅
6. After Phase 6: Documentation updated, all tests pass ✅ (495 backend tests total)

**Final Test Status**: All 495 backend tests passing (26 test suites) with migration code removed.

## Implementation Status

Task phases:

- [x] Phase 1: Schema Foundation (7 tasks) - All completed
- [x] Phase 2: Config Services (7 tasks) - All completed (56 unit tests)
- [x] ~~Phase 3: Migration System~~ (REMOVED - migration code deleted)
- [x] Phase 4: API Integration (7 tasks) - All completed (29 unit tests)
- [x] Phase 5: Frontend Updates (5 tasks) - All completed
- [x] Phase 6: Documentation & Validation (4 remaining tasks) - All completed

**Implementation Complete**: All unified configuration system tasks finished. Migration requirement removed from artifacts and source code.
