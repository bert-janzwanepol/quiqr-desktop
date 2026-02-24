## Why

Multiple settings are currently scattered across menu items and implicit
locations, making them hard to discover and manage. This change consolidates
five specific settings (card view, experimental features, role setting, Hugo
draft mode, and Hugo auto serve) into the centralized Preferences views where
users expect to find them.

## What Changes

- Move **library view mode setting** (sitesListingView) from implicit control to Preferences UI: Preferences->Appearance - controls list vs card view display; remove toolbar switch button
- Move **experimental features toggle** from Edit menu to Preferences UI: AppSettings->Feature Flags(New); remove "Enable Experimental" menu item, keep conditional "Experimental" submenu
- Move **role setting** (applicationRole) from Edit menu to Preferences UI: Preferences->Behaviour(New); use values contentEditor/siteDeveloper (not developer/editor/writer)
- Move **Hugo draft mode** (hugo.serveDraftMode) from Hugo menu to Preferences UI: AppSettings->Hugo(New); remove "Server Draft Mode" menu item
- Move **Hugo auto serve** (hugo.disableAutoHugoServe) from Hugo menu to Preferences UI: AppSettings->Hugo(New); remove "Disable Auto Serve" menu item
- Rename Preferences->General to Preferences->Appearance
- Rename Preferences->Advanced to Preferences->Behaviour and remove obsolete fields (openInCommand, gitBinary, logRetentionDays)
- Update menu adapters (Electron and standalone) to remove role setting and "Enable Experimental" menu items
- Ensure menu reloads when experimental features setting changes
- Ensure all moved settings maintain their backend storage and API contracts
- Fix App.tsx to use unified config API (getEffectivePreference/setUserPreference) instead of legacy API

## Capabilities

### New Capabilities

None - this change reorganizes existing functionality without introducing new capabilities.

### Modified Capabilities

- `application-settings-ui`: Add UI controls for experimental features, Hugo draft mode, and Hugo auto serve settings to the appropriate Application Settings pages
- `unified-config`: Update requirement documentation to reflect that these settings are now managed through the Preferences UI (implementation details only - no schema or API changes required)

## Impact

**Frontend affected:**
- `packages/frontend/src/containers/Prefs/` - Add form controls for the five settings with correct values, add snackbar feedback
- `packages/frontend/src/containers/SiteLibrary/SiteLibraryToolbarRight.tsx` - Remove centerItems (toolbar switch button)
- `packages/frontend/src/App.tsx` - Replace local state with React Query for reactive preferences (sitesListingView, applicationRole)

**Backend affected:**
- `packages/backend/src/api/handlers/config-handlers.ts` - Add menu rebuild when experimental features changes
- `packages/adapters/electron/src/ui-managers/menu-manager.ts` - Remove role setting and "Enable Experimental" menu items; update to use unified config service instead of legacy AppConfig
- `packages/adapters/standalone/src/adapters/menu-adapter.ts` - Remove role setting and "Enable Experimental" menu items; update to use unified config service instead of legacy AppConfig

**Type system:**
- `packages/types/src/schemas/config.ts` - No schema changes needed, but may need to clarify which settings belong in which file

**User experience:**
- Users will find these settings in consistent, expected locations within Preferences
- Settings previously only accessible via menus or implicitly will be explicitly visible and discoverable
- No breaking changes to saved configuration data

## Non-goals

- Do not change the underlying storage location or API contracts for these settings (they remain in instanceSettings or userConfig)
- Do not add new settings or remove existing functionality
- Do not implement role-based access control (that's deferred per application-settings-ui spec)
- Do not migrate existing user configuration data (settings will continue to work as-is)
