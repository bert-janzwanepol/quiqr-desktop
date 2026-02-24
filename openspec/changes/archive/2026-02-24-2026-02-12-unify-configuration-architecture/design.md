# Design: Unified Configuration Architecture

**Change ID:** `unify-configuration-architecture`

## Overview

This document captures architectural decisions for the unified configuration system that supports both single-user desktop and multi-user server deployments.

## Architecture Decisions

### ADR-1: Simplified Configuration Structure

**Context:** Need a simple, clear separation between instance-level settings and user preferences.

**Decision:** Use a two-file structure with clear boundaries:

**`instance_settings.json`** - Instance-level configuration:
```
{
  "storage": { "type": "fs", "dataFolder": "/home/user/QuiqrData" },
  "logging": { "logRetentionDays": 30, "logLevel": "info" },
  "experimentalFeatures": false,
  "dev": { "localApi": false, "showCurrentUser": false, "disablePartialCache": false },
  "hugo": { "serveDraftMode": false, "disableAutoHugoServe": false }
}
```

**`user_prefs_ELECTRON.json`** - User preferences (Electron single-user):
```
{
  "userId": "ELECTRON",
  "preferences": { "interfaceStyle": "quiqr10-dark" },
  "lastOpenedSite": { "siteKey": null, "workspaceKey": null, "sitePath": null },
  "lastOpenedPublishTargetForSite": {},
  "skipWelcomeScreen": false,
  "sitesListingView": "all"
}
```

**Consequences:**
- Clear separation: instance settings vs user preferences
- No forced/overridable complexity - just hardcoded defaults + user overrides
- Groups and site-specific settings deferred to future changes
- Electron edition uses `user_prefs_ELECTRON.json` for clarity

### ADR-2: Simple Two-Layer Resolution

**Context:** Complex layering adds unnecessary complexity for current needs.

**Decision:** Implement simple 2-layer resolution:

| Layer | Priority | Source |
|-------|----------|--------|
| App Defaults | 1 (lowest) | Hardcoded in source |
| User Preferences | 2 (highest) | `user_prefs_[user].json` |

**Resolution Algorithm:**
```typescript
function getUserPreference(key: string, userId: string): unknown {
  // User preference overrides app default
  const userConfig = loadUserConfig(userId);
  if (userConfig.preferences?.[key] !== undefined) {
    return userConfig.preferences[key];
  }

  // Fall back to app default
  return APP_DEFAULTS.preferences[key];
}

function getInstanceSetting(path: string): unknown {
  // Instance setting overrides app default
  const instanceConfig = loadInstanceConfig();
  const value = getNestedValue(instanceConfig, path);
  if (value !== undefined) {
    return value;
  }

  // Fall back to app default
  return getNestedValue(APP_DEFAULTS.instance, path);
}
```

**Consequences:**
- Simple, predictable behavior
- No forced/default/group complexity
- Groups and forced preferences deferred to future multi-user changes

### ADR-3: File-Based Storage with Environment Override

**Context:** Need persistent storage that works on all platforms while supporting secrets injection.

**Decision:** Use JSON files in platform-specific config directory with environment variable overrides.

**Storage Location:** `$HOME/.config/quiqr/` (Linux), `~/Library/Application Support/quiqr/` (macOS), `%AppData%\quiqr\` (Windows)

**Files:**
```
instance_settings.json      # Instance-level settings (storage, logging, dev, hugo)
user_prefs_ELECTRON.json    # User preferences (Electron single-user edition)
user_prefs_[userId].json    # User preferences (future multi-user mode)
```

**Environment Variable Mapping:**
```
QUIQR_STORAGE_TYPE           → instance.settings.storage.type
QUIQR_STORAGE_DATAFOLDER     → instance.settings.storage.dataFolder
QUIQR_LLM_PROVIDER_0         → instance.settings.llm.providers[0]
QUIQR_SECRETS_*              → age-encrypted secret refs
```

**Consequences:**
- Secrets never stored in plaintext files
- Docker/K8s deployments can inject config via env vars
- File-based config enables version control of instance settings

### ADR-4: Electron Single-User Mode

**Context:** Electron desktop edition is single-user by default.

**Decision:** Use `user_prefs_ELECTRON.json` for Electron single-user edition:
- Fixed userId: `"ELECTRON"`
- File name clearly indicates it's the Electron edition
- No multi-user complexity in Electron mode
- All APIs use `"ELECTRON"` as default userId

**Implementation:**
```typescript
// Electron edition always uses "ELECTRON" userId
const DEFAULT_USER_ID = 'ELECTRON';
const userConfigFile = `user_prefs_${DEFAULT_USER_ID}.json`;
```

**Consequences:**
- Clear distinction between Electron (single-user) and future multi-user modes
- File name self-documenting
- No confusion with "default" terminology

### ADR-5: Zod Schema Organization

**Context:** Need comprehensive type definitions for the new configuration tree.

**Decision:** Organize schemas in `@quiqr/types`:

```typescript
// packages/types/src/schemas/config.ts

// Leaf value schemas (reusable)
const storageTypeSchema = z.enum(['fs', 's3', 'gcs']);
const interfaceStyleSchema = z.enum(['quiqr10-light', 'quiqr10-dark']);

// Preference schemas (user-configurable)
const userPreferencesSchema = z.object({
  interfaceStyle: interfaceStyleSchema.optional(),
  dataFolder: z.string().optional(),
  // ... all preference keys
});

// Instance settings schema
const instanceSettingsSchema = z.object({
  multiUserEnabled: z.boolean().default(false),
  storage: z.object({
    type: storageTypeSchema.default('fs'),
    dataFolder: z.string().default('~/Quiqr'),
  }),
  user_default_preferences: userPreferencesSchema.optional(),
  user_forced_preferences: userPreferencesSchema.partial().optional(),
});

// Group schema
const groupConfigSchema = z.object({
  name: z.string(),
  preferences: userPreferencesSchema.partial().optional(),
});

// Full instance config
const instanceConfigSchema = z.object({
  settings: instanceSettingsSchema,
  groups: z.record(z.string(), groupConfigSchema).optional(),
});

// User config (separate file)
const userConfigSchema = z.object({
  userId: z.string(),
  preferences: userPreferencesSchema,
  groupId: z.string().optional(),
});
```

**Consequences:**
- Full TypeScript inference for all config paths
- Runtime validation of config files
- Self-documenting configuration structure

### ADR-6: No Migration - Hardcoded Defaults

**Context:** Existing users have minimal settings in `quiqr-app-config.json`, and the current system has comprehensive hardcoded defaults.

**Decision:** Do not implement automatic migration. Instead:

1. Rely on hardcoded defaults for all initial values
2. Old config files are ignored (not read or migrated)
3. Users start with fresh configuration using new structure
4. All settings have sensible defaults, so no data loss

**Rationale:**
- Current user base is small and settings are minimal
- Hardcoded defaults already provide complete initial configuration
- Migration complexity not justified by current usage
- Clean break enables simpler implementation

**Consequences:**
- Users will see default settings on first run with new version
- No risk of migration bugs or edge cases
- Simpler codebase without migration logic
- Users can reconfigure their preferences (minimal effort given limited current settings)

## Component Interactions

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│  api.getConfig('instance.settings.storage.type')           │
│  api.setUserPreference('interfaceStyle', 'dark')           │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP
┌─────────────────────────▼───────────────────────────────────┐
│                     Backend (Express)                       │
│  ConfigHandlers → UnifiedConfigService                     │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│              UnifiedConfigService                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ConfigResolver                                       │  │
│  │  - resolveValue(path, userId, groupId)               │  │
│  │  - getEffectivePreferences(userId)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ConfigStore                                          │  │
│  │  - loadInstanceConfig()                              │  │
│  │  - loadUserConfig(userId)                            │  │
│  │  - saveUserPreference(userId, key, value)            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  EnvOverrideLayer                                     │  │
│  │  - getEnvOverride(configPath)                        │  │
│  │  - QUIQR_* env var mapping                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Open Questions

1. **Site-level settings file granularity:** Should each site have its own file, or store all in `instance_settings.json`?
   - Recommendation: Separate files for deployments with many sites

> Answer: Seperate files

2. **Group membership storage:** Where to store user-to-group mappings in multi-user mode?
   - Recommendation: In `instance_settings.json` for admin control

> Answer: This is out of scope for now. This is a seperate concern.

3. **Config file permissions:** Should config files have restricted permissions (0600)?
   - Recommendation: Yes, especially for files that may contain secrets

> Anser: Out of scope: This is not a concern for the Quiqr application.

## Alternatives Considered

### Alternative A: SQLite Database
- Pros: Atomic writes, querying capability
- Cons: Binary format, harder to debug, overkill for config

### Alternative B: Single Merged Config File
- Pros: Simpler implementation
- Cons: Multi-user editing conflicts, large file for many users

### Alternative C: Platform Keychain for Secrets
- Pros: OS-level security
- Cons: Cross-platform complexity, not scriptable
- Decision: May add as optional enhancement later
