# Implementation Tasks: Move and Fix Settings/Preferences

## 1. Backend API Verification

- [x] 1.1 Verify `sitesListingView` is accessible via `api.getEffectivePreference` and `api.setUserPreference`
- [x] 1.2 Verify `applicationRole` is accessible via `api.getEffectivePreference` and `api.setUserPreference`
- [x] 1.3 Verify `experimentalFeatures` is accessible via `api.getInstanceSetting` and `api.setInstanceSetting`
- [x] 1.4 Verify `hugo.serveDraftMode` is accessible via `api.getInstanceSetting` and `api.setInstanceSetting`
- [x] 1.5 Verify `hugo.disableAutoHugoServe` is accessible via `api.getInstanceSetting` and `api.setInstanceSetting`
- [x] 1.6 Add any missing API support in `packages/backend/src/api/handlers/config-handlers.ts` if needed

## 2. Query/Mutation Options

- [x] 2.1 Add `instanceSettingsQueryOptions.get(path)` to `packages/frontend/src/queries/options.ts`
- [x] 2.2 Add `instanceSettingsMutationOptions.save(queryClient)` to `packages/frontend/src/queries/options.ts`
- [x] 2.3 Ensure query invalidation triggers for instance settings changes

## 3. Create New Preferences Pages

- [x] 3.1 Create `packages/frontend/src/containers/Prefs/PrefsAdvanced.tsx` with role setting control (titled "Behaviour")
- [x] 3.2 Create `packages/frontend/src/containers/Prefs/PrefsAppSettingsGeneral.tsx` with experimental features toggle (titled "Feature Flags")
- [x] 3.3 Create `packages/frontend/src/containers/Prefs/PrefsHugo.tsx` with Hugo draft mode and auto serve toggles

## 4. Update Existing Preferences Pages

- [x] 4.1 Rename PrefsGeneral.tsx to "Appearance" and add library view mode control (cards/list)
- [x] 4.2 Remove obsolete fields from PrefsAdvanced.tsx (openInCommand, gitBinary, logRetentionDays)

## 5. Update Preferences Sidebar

- [x] 5.1 Edit `packages/frontend/src/containers/Prefs/PrefsSidebar.tsx` to add "Behaviour" menu item under Preferences group
- [x] 5.2 Add "Feature Flags" menu item to Application Settings group (route: `/prefs/appsettings-general`)
- [x] 5.3 Add "Hugo" menu item to Application Settings group (route: `/prefs/hugo`)
- [x] 5.4 Move "Feature Flags" to bottom of Application Settings menu

## 6. Update Routing

- [x] 6.1 Add route for `/prefs/advanced` in `packages/frontend/src/containers/Prefs/PrefsRouted.tsx`
- [x] 6.2 Add route for `/prefs/appsettings-general` in `packages/frontend/src/containers/Prefs/PrefsRouted.tsx`
- [x] 6.3 Add route for `/prefs/hugo` in `packages/frontend/src/containers/Prefs/PrefsRouted.tsx`

## 7. Remove Menu Adapter Items

- [x] 7.1 Remove or comment out role setting menu items in `packages/adapters/electron/src/ui-managers/menu-manager.ts`
- [x] 7.2 Remove or comment out role setting menu items in `packages/adapters/standalone/src/adapters/menu-adapter.ts`
- [x] 7.3 Add comments indicating settings moved to Preferences UI

## 8. Remove Implicit Card View Controls

- [x] 8.1 Identify and remove any implicit card view toggle controls in Site Library or workspace views
- [x] 8.2 Ensure Site Library respects sitesListingView preference from unified config

## 9. Testing

- [ ] 9.1 Test library view mode setting saves and loads correctly in Preferences > Appearance
- [ ] 9.2 Test role setting saves and loads correctly in Preferences > Behaviour
- [ ] 9.3 Test experimental features toggle saves and loads correctly in Application Settings > Feature Flags
- [ ] 9.4 Test Hugo draft mode toggle saves and loads correctly in Application Settings > Hugo
- [ ] 9.5 Test Hugo auto serve toggle saves and loads correctly in Application Settings > Hugo
- [ ] 9.6 Verify role setting change updates workspace menu filtering
- [ ] 9.7 Verify library view mode setting switches Site Library between card and list display
- [ ] 9.8 Verify experimental features toggle enables/disables experimental features
- [ ] 9.9 Verify Hugo draft mode affects next Hugo serve process
- [ ] 9.10 Verify Hugo auto serve setting prevents/allows automatic serve on workspace open
- [ ] 9.11 Test on Electron edition
- [ ] 9.12 Test on standalone edition

## 10. Documentation

- [ ] 10.1 Update user documentation to reflect new settings locations
- [ ] 10.2 Add inline help text or tooltips for each setting explaining its purpose (DONE - added to UI components)
