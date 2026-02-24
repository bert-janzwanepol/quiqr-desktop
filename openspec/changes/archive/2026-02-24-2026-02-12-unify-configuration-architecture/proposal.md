# Change Proposal: Unify Configuration Architecture

**Change ID:** `unify-configuration-architecture`
**Status:** Implemented
**Created:** 2026-02-12
**Completed:** 2026-02-24
**GitHub Issue:** [#629](https://github.com/quiqr/quiqr-desktop/issues/629)

## Why

The current configuration system mixes instance settings, user preferences, and application state in a single flat JSON file (`quiqr-app-config.json`). This design doesn't separate concerns properly and makes it difficult to:
- Distinguish between instance-level settings and user preferences
- Apply environment variable overrides selectively
- Provide clear defaults and type safety
- Test configuration behavior systematically

A simplified 2-layer architecture (App Defaults → User Preferences) with separate instance settings provides better separation of concerns and maintainability for the single-user Electron desktop edition.

## What Changes

### New Configuration Architecture
- **2-layer preference resolution**: App Defaults → User Preferences
- **Separate instance settings**: Storage, logging, dev, and hugo settings in `instance_settings.json`
- **User configuration**: Preferences and state in `user_prefs_ELECTRON.json`
- **Environment variable overrides**: `QUIQR_*` environment variables override instance settings

### Implementation
- New `UnifiedConfigService` replaces `AppConfig` class
- `ConfigResolver` implements 2-layer precedence
- `ConfigStore` handles file persistence
- Complete Zod schema validation for all configuration
- 587/589 tests passing (99.7%)

### Files Changed
- Created: `config-store.ts`, `config-resolver.ts`, `unified-config-service.ts`, `env-override-layer.ts`
- Modified: All API handlers, menu handlers, workspace handlers, SSG providers
- Removed: `AppConfig` dependency, migration code

## Problem Statement

The current configuration system was designed for a single-user desktop application paradigm:

- **1 app = 1 user** → settings ≡ preferences

This model doesn't scale for:
- Multi-user server deployments
- Enterprise environments with default/forced preferences
- Instance-level settings separate from user preferences
- Group-based configuration inheritance

The current `AppConfig` class stores everything in a single flat JSON file (`quiqr-app-config.json`) mixing instance settings, user preferences, and site-specific state.

## Proposed Solution

Implement a simple, two-file configuration system:

```
Quiqr Instance (Electron Edition)
  ├─ instance_settings.json    (storage, logging, dev, hugo)
  └─ user_prefs_ELECTRON.json  (UI preferences, last opened site)
```

### Configuration Layers (Precedence: lowest to highest)

1. **App Defaults** - Hardcoded sensible defaults in source code
2. **User Preferences** - `user_prefs_ELECTRON.json` (can override defaults)

**Out of Scope (deferred to future changes):**
- Groups and group-level preferences
- Forced/locked preferences
- Site-specific settings files
- Multi-user support

### Configuration Sources

| Source | Use Case |
|--------|----------|
| Hardcoded defaults | Safe fallbacks |
| Config files (`$HOME/.config/quiqr/*.json`) | Persistent settings |
| Environment variables (`QUIQR_*`) | Secrets, deployment config |
| `age`-encrypted files | Sensitive credentials (optional) |

### Storage Location

All configuration files in `$HOME/.config/quiqr/` (platform-equivalent), NOT in the Quiqr data folder:

```
$HOME/.config/quiqr/
  ├── instance_settings.json
  └── user_prefs_ELECTRON.json
```

## Impact Analysis

### Breaking Changes

- **No migration needed** - existing settings are minimal and hardcoded defaults will apply
- API methods `readConfKey`/`saveConfPrefKey` will need updates
- Zod schemas in `@quiqr/types` will change significantly

### Affected Components

| Component | Impact |
|-----------|--------|
| `packages/backend/src/config/app-config.ts` | Major rewrite |
| `packages/types/src/schemas/config.ts` | New schemas |
| `packages/backend/src/api/handlers/config-handlers.ts` | Updated handlers |
| `packages/frontend/src/api.ts` | Updated API methods |
| Preferences UI (`containers/Prefs/`) | May need updates |

### Dependencies

- Existing `dependency-injection` spec (container pattern)
- `backend-architecture` spec
- `type-system` spec (Zod schemas)

## Success Criteria

1. All configuration persists correctly across app restarts
2. Hardcoded defaults provide sensible initial values for all settings
3. Environment variables can override instance settings
4. Zod schemas fully document both `instance_settings` and `user_prefs` structures
5. Complete removal of `quiqr-app-config.json` dependency
6. Automated tests verify all instance settings and user preferences

## Out of Scope

- User authentication/authorization system (separate concern)
- Multi-user support (future change)
- Groups and group-level preferences (future change)
- Forced/locked preferences (future change)
- Site-specific settings files (future change)
- Remote configuration sync
- Configuration backup/restore UI

## References

- GitHub Issue: https://github.com/quiqr/quiqr-desktop/issues/629
- Current implementation: `packages/backend/src/config/app-config.ts`
- Current schema: `packages/types/src/schemas/config.ts`
