## Why

Users need a centralized location to manage application-level settings (like storage paths) separately from site-specific configurations and user preferences. Currently, there's no dedicated UI for modifying application settings, requiring manual file editing. This change introduces an Application Settings section in the Preferences view to make these settings accessible and user-friendly.

**Important architectural distinction:** Application Settings are system-wide configuration for the Quiqr application itself (only modifiable in Electron edition, as it's single-user). User Preferences are per-user settings that will be modifiable in both Electron and standalone editions. In standalone edition (multi-user), application settings will eventually be hidden or restricted to admin users only. This change establishes the UI separation to support this architecture.

## What Changes

- Add new "Application Settings" section in the Preferences sidebar
- Create "Storage" view as the first settings page under Application Settings
- Implement UI for viewing and modifying the storage path setting
- Wire storage path changes to existing settings persistence (AppConfig/AppState)
- Ensure storage path UI works in both Electron and standalone modes

## Capabilities

### New Capabilities
- `application-settings-ui`: User interface for managing application-level settings in the Preferences view, including sidebar navigation and settings pages
- `storage-path-configuration`: UI and backend support for viewing and modifying the application's storage path setting

### Modified Capabilities
<!-- No existing capabilities have requirement changes - this is purely additive -->

## Impact

**Frontend:**
- `packages/frontend/src/containers/Preferences/` - Add Application Settings section and Storage view
- `packages/frontend/src/api.ts` - Add API methods for getting/setting storage path if needed

**Backend:**
- `packages/backend/src/api/handlers/` - Add handlers for storage path get/set operations if not already exposed
- `packages/backend/src/config/` - Ensure AppConfig/AppState exposes storage path configuration

**Types:**
- `packages/types/src/schemas/api.ts` - Add API schemas for storage path operations if needed

**Cross-cutting:**
- Must work in both Electron and standalone runtime modes
- Related to the unified configuration architecture work (2026-02-12-unify-configuration-architecture)
- Establishes UI separation between Application Settings (system-wide) and Preferences (user-specific)

**Architectural Notes:**
- Electron edition: Application Settings are fully editable (single-user application)
- Standalone edition: Application Settings should eventually be admin-only or hidden for regular users
- This change does NOT implement access control - it establishes the UI structure for future enforcement

## Non-goals

- Migrating other application settings to this UI (future work)
- Validating or migrating existing storage paths (assume current path is valid)
- Adding import/export of application settings
- Implementing storage path auto-detection or recommendations
- Hiding or restricting Application Settings in standalone edition (future work - this change only establishes the UI structure)
- Implementing user role/permission checks or admin-only access control
