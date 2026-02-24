# Design: Move and Fix Settings/Preferences

## Context

Currently, five settings are scattered across different UI locations:
- **Library view mode** (sitesListingView): Implicitly controlled, should switch between list/card view
- **Role setting** (applicationRole): Available via menu items in adapters
- **Experimental features**: No UI control, only accessible via config file
- **Hugo draft mode**: No UI control, only accessible via config file
- **Hugo auto serve**: No UI control, only accessible via config file

The unified configuration system is already implemented with proper API methods (`api.getEffectivePreference`, `api.setUserPreference`, `api.getInstanceSetting`, `api.setInstanceSetting`). These settings are already stored in the correct files (instance_settings.json or user_prefs_ELECTRON.json).

The existing Preferences UI follows a pattern:
- Components in `packages/frontend/src/containers/Prefs/`
- React Query for state management (useQuery, useMutation)
- MUI components for forms (Select, TextField, Switch, etc.)
- Centralized query/mutation options in `packages/frontend/src/queries/options.ts`
- Sidebar navigation with menu groups (Preferences vs Application Settings)

## Goals / Non-Goals

**Goals:**
- Add UI controls for five settings to appropriate Preferences pages
- Create/update Preferences pages: Appearance (rename from General), Behaviour (rename from Advanced, remove obsolete fields), Feature Flags (new), and Hugo (new)
- Update PrefsSidebar to include renamed/new menu items with Feature Flags at bottom
- Remove role setting menu items from Electron and standalone adapters
- Maintain existing backend API contracts (no backend changes required)

**Non-Goals:**
- Do not change underlying storage locations or API methods
- Do not implement role-based access control (deferred)
- Do not migrate existing configuration data
- Do not add new settings beyond the five specified

## Decisions

### Decision 1: Page Layout and Routing

**Choice:** Update existing and create new page components:
- `/prefs/general` - PrefsGeneral.tsx renamed to "Appearance" (library view mode: cards/list)
- `/prefs/advanced` - PrefsAdvanced.tsx renamed to "Behaviour" (role setting only, obsolete fields removed)
- `/prefs/appsettings-general` - PrefsAppSettingsGeneral.tsx as "Feature Flags" (experimental features)
- `/prefs/hugo` - PrefsHugo.tsx (Hugo-specific settings)

**Rationale:**
- "Appearance" better describes visual/display settings (theme, view mode)
- "Behaviour" better describes functional settings (role affecting menu behavior)
- "Feature Flags" clearly indicates experimental/preview features
- Obsolete fields removed from Behaviour page (openInCommand, gitBinary, logRetentionDays moved elsewhere or deprecated)
- Follows existing pattern (one component per route)
- Separates user-level preferences from instance-level settings

**Alternatives considered:**
- Keep "General" and "Advanced" names → Rejected as less descriptive
- Keep obsolete fields in Behaviour → Rejected as they belong in other pages or are deprecated

### Decision 2: Form Components and Controls

**Choice:** Use MUI components following the existing pattern:
- `Select` with `MenuItem` for role setting and card view (dropdown)
- `Switch` for boolean toggles (experimental features, Hugo draft mode, Hugo auto serve)
- `FormControl` with `InputLabel` for structured forms
- `Box` for layout and spacing

**Rationale:**
- Consistent with existing Preferences pages (see PrefsGeneral.tsx)
- MUI v7 is the established UI library for this project
- Switch components provide clear visual feedback for boolean settings

**Alternatives considered:**
- Checkbox for booleans → Rejected in favor of Switch for better mobile/touch UX
- Radio buttons for role/card view → Rejected because Select dropdowns are more compact

### Decision 3: State Management Pattern

**Choice:** Use React Query (TanStack Query) with centralized query/mutation options:
- `prefsQueryOptions.all()` for fetching preferences
- `prefsMutationOptions.save(queryClient)` for saving preferences
- New `instanceSettingsQueryOptions` and `instanceSettingsMutationOptions` for instance settings
- Query invalidation to trigger UI updates across the application

**Rationale:**
- Matches existing pattern in PrefsGeneral.tsx
- Provides automatic caching, refetching, and optimistic updates
- Centralized options make it easy to maintain consistent behavior
- Query invalidation ensures all UI components reflect updated values without manual refresh

**Alternatives considered:**
- Direct API calls without React Query → Rejected because it would deviate from established pattern
- Context API for state → Rejected because React Query already handles this better

### Decision 4: API Usage

**Choice:** Use existing unified config API methods:
- User preferences: `api.getEffectivePreference(key)` and `api.setUserPreference(key, value)`
- Instance settings: `api.getInstanceSetting(path)` and `api.setInstanceSetting(path, value)`

**Rationale:**
- API already exists and is working correctly
- No backend changes required
- Clear separation between user and instance settings

### Decision 5: Menu Adapter Changes

**Choice:** Remove role setting and "Enable Experimental" menu items from:
- `packages/adapters/electron/src/ui-managers/menu-manager.ts`
- `packages/adapters/standalone/src/adapters/menu-adapter.ts`

Keep conditional "Experimental" submenu that shows only when experimental features are enabled.

Add comments indicating settings have moved to Preferences UI.

**Rationale:**
- Eliminates duplicate/conflicting UI controls
- Directs users to the canonical location (Preferences)
- Maintains backward compatibility (settings still work, just accessed differently)
- "Experimental" submenu remains useful as quick access to advanced features

**Alternatives considered:**
- Keep menu items and add UI controls → Rejected because it creates confusion about which is authoritative
- Redirect menu items to Preferences → Rejected as unnecessarily complex
- Remove entire Experimental submenu → Rejected because it provides useful quick access to cache/debug tools

### Decision 6: Menu Rebuild on Settings Change

**Choice:** Trigger menu rebuild when experimental features setting changes via:
- Add `container.adapters.menu.createMainMenu()` call in `createUpdateInstanceSettingsHandler` when experimentalFeatures changes
- This ensures the "Experimental" submenu appears/disappears immediately

**Rationale:**
- Menu state must reflect current settings without requiring app restart
- Consistent with existing pattern (menu-handlers.ts already does this for toggleExperimental action)
- Provides immediate visual feedback to user

**Alternatives considered:**
- Require app restart → Rejected as poor UX
- Poll for changes → Rejected as inefficient and adds complexity

### Decision 7: Sidebar Menu Structure

**Choice:** Update PrefsSidebar.tsx to add:
- "Behaviour" item under Preferences menu group (renamed from "Advanced")
- "Feature Flags" and "Hugo" items under Application Settings menu group
- "Feature Flags" at bottom of Application Settings menu

**Rationale:**
- Maintains existing two-group structure (Preferences vs Application Settings)
- Alphabetical or logical ordering within each group
- Clear visual distinction between user preferences and application settings
- "Feature Flags" at bottom emphasizes experimental nature

### Decision 8: Role Values and Behavior

**Choice:** Use two role values:
- `contentEditor` - Default role, shows standard content editing features
- `siteDeveloper` - Advanced role, shows all features including Sync, Site Configuration, Tools, and Site Log

**Rationale:**
- Matches existing role system already implemented in WorkspaceSidebar.tsx and useWorkspaceToolbarItems.tsx
- Clear naming that reflects purpose (editing content vs developing sites)
- siteDeveloper enables advanced features that typical content editors don't need

**Alternatives considered:**
- Three roles (developer/editor/writer) → Rejected as these don't match existing implementation
- Different naming → Rejected to maintain consistency with existing code

### Decision 9: Toolbar Switch Button Removal

**Choice:** Remove centerItems (toolbar switch button) from SiteLibraryToolbarRight.tsx

**Rationale:**
- Eliminates duplicate control (now in Preferences > Appearance)
- Settings should be in one canonical location
- Reduces UI clutter in toolbar
- Consistent with decision to move all settings to Preferences

**Alternatives considered:**
- Keep both toolbar button and preferences → Rejected as confusing (two sources of truth)
- Add sync between them → Rejected as unnecessarily complex

### Decision 10: App.tsx Unified Config API Migration

**Choice:** Update App.tsx to use unified config API:
- Replace `readConfPrefKey("libraryView")` with `getEffectivePreference("sitesListingView")`
- Replace `saveConfPrefKey("libraryView", ...)` with `setUserPreference("sitesListingView", ...)`

**Rationale:**
- Ensures consistency with rest of application (PrefsGeneral.tsx already uses unified API)
- Fixes bug where setting saves but doesn't take effect
- Follows architectural decision to use unified config throughout

**Alternatives considered:**
- Keep legacy API → Rejected as it was causing the bug and is deprecated

## Implementation Fixes

During implementation, several issues were discovered and fixed:

### Round 1 - Initial Implementation
1. **Library View Not Switching**: App.tsx was using legacy API (`readConfPrefKey("libraryView")`) instead of unified config API. Fixed by updating to use `getEffectivePreference("sitesListingView")` and `setUserPreference("sitesListingView", ...)`.

2. **Incorrect Role Values**: Initial implementation used "developer", "editor", "writer" but codebase actually uses "contentEditor" and "siteDeveloper". Fixed by updating PrefsAdvanced.tsx to use correct values.

3. **Experimental Menu Not Updating**: When experimental features toggle changed via Preferences, menu didn't rebuild. Fixed by adding `container.adapters.menu.createMainMenu()` call in `createUpdateInstanceSettingsHandler` when experimentalFeatures changes.

4. **Toolbar Button Removed**: Removed centerItems (switch button) from SiteLibraryToolbarRight.tsx as requested - view mode now controlled solely via Preferences.

### Round 2 - Reactivity Fixes
5. **Library View Still Not Taking Effect**: App.tsx stored preferences in local state which didn't update when changed. Fixed by replacing local state with React Query (`useQuery(prefsQueryOptions.all())`) so App.tsx automatically re-renders when preferences change.

6. **Missing Snackbar Feedback**: Added snackbar messages to PrefsGeneral and PrefsAdvanced to confirm when settings are saved successfully.

7. **Role Setting Not Taking Effect**: Same root cause as #5 - App.tsx wasn't reactive to preference changes. Fixing #5 also fixed this issue.

8. **Electron Menu Not Reloading**: Electron menu manager was reading from legacy `container.config` (AppConfig) which doesn't update when unified config changes. Fixed by updating `updateOptionsFromConfig()` to read from `container.unifiedConfig` using `getInstanceSetting()` and `getEffectivePreference()` methods.

### Round 3 - Standalone Menu Fixes
9. **Standalone Menu Not Using Unified Config**: Standalone menu adapter had same issue as #8 - it was reading from legacy `container.config` which doesn't update when unified config changes. Fixed by updating `buildMenuState()` to read from `container.unifiedConfig` and using local variables instead of `config.experimentalFeatures`, `config.disablePartialCache`, `config.hugoServeDraftMode`, and `config.devDisableAutoHugoServe`.

10. **Standalone Menu Not Refreshing**: After toggling experimental features in Preferences, the frontend menu bar wasn't refreshing to show/hide the experimental submenu. Fixed by:
    - PrefsAppSettingsGeneral dispatches custom event `'menu-state-changed'` after successful mutation
    - MenuBar component listens for this event and calls `refresh()` to fetch updated menu state from backend
    - This ensures the menu bar re-renders with the latest menu structure

11. **Hugo Settings Menu Items Removed**: Removed "Server Draft Mode" and "Disable Auto Serve" menu items from both Electron and standalone Hugo menus. These settings are now only accessible via Application Settings > Hugo in the Preferences UI. Menu handlers kept for backwards compatibility but deprecated.

## Risks / Trade-offs

**[Risk]** ~~Card view setting currently implicit - may not have backend API support~~
→ **Resolved:** Verified `sitesListingView` is accessible via unified config API. Fixed App.tsx to use correct API methods.

**[Risk]** ~~Role setting change may not trigger immediate menu filtering update~~
→ **Resolved:** Role-based filtering already works correctly in WorkspaceSidebar.tsx and useWorkspaceToolbarItems.tsx.

**[Risk]** Hugo settings changes (draft mode, auto serve) may not affect running Hugo processes
→ **Mitigation:** Document that settings take effect on next Hugo serve start. Consider adding note in UI or triggering server restart.

**[Risk]** Creating three new pages increases bundle size
→ **Mitigation:** Acceptable trade-off for better UX. Pages are small and use code splitting via React Router.

**[Trade-off]** Hugo settings on dedicated page vs Storage page
→ **Decision:** Dedicated page provides room for future Hugo settings. More discoverable than buried in Storage page.

**[Trade-off]** Advanced page for single setting (role)
→ **Decision:** Creates room for future advanced preferences. Better than overloading General page.

## Migration Plan

**Deployment:**
1. Frontend changes only - no backend/API changes required
2. Build and deploy frontend bundle
3. No database migrations needed (settings already in config files)
4. Settings continue to work immediately with new UI

**Rollback strategy:**
- If issues arise, revert frontend code to previous version
- No data cleanup required (settings remain in config files)
- Menu adapters revert to showing role setting menu items

**Testing:**
- Manual testing: Verify each setting saves and loads correctly
- Test setting changes reflect across application (e.g., role affects menu, draft mode affects Hugo serve)
- Test on both Electron and standalone editions
- Verify existing config files continue to work without migration

## Open Questions

None - design is straightforward with established patterns.
