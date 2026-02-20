## 1. Type System Setup

- [ ] 1.1 Add Zod schemas for storage path API in `packages/types/src/schemas/api.ts` (setStoragePathRequest, getStoragePathResponse)
- [ ] 1.2 Rebuild types package to propagate schema changes

## 2. Backend API Implementation

- [ ] 2.1 Add GET /api/storage-path handler in `packages/backend/src/api/handlers/config-handlers.ts`
- [ ] 2.2 Add POST /api/storage-path handler in `packages/backend/src/api/handlers/config-handlers.ts`
- [ ] 2.3 Wire up handlers in Express router (in `packages/backend/src/api/server.ts`)
- [ ] 2.4 Ensure AppConfig.prefs.dataFolder is accessible and persisted correctly

## 3. Frontend API Client

- [ ] 3.1 Add getStoragePath() method in `packages/frontend/src/api.ts`
- [ ] 3.2 Add setStoragePath(path: string) method in `packages/frontend/src/api.ts`

## 4. Storage Settings Page Component

- [ ] 4.1 Create PrefsApplicationStorage.tsx component in `packages/frontend/src/containers/Prefs/`
- [ ] 4.2 Implement storage path display using read-only TextField
- [ ] 4.3 Add "Change Path" button that calls showOpenFolderDialog API
- [ ] 4.4 Implement path update flow (select directory → call setStoragePath API → update display)
- [ ] 4.5 Add success notification with restart advisory message
- [ ] 4.6 Add error handling and error display for failed saves
- [ ] 4.7 Match styling and layout pattern from PrefsGeneral.tsx

## 5. Sidebar and Routing Integration

- [ ] 5.1 Update PrefsSidebar.tsx to add second menu group "Application Settings" with Storage item
- [ ] 5.2 Add route for /prefs/storage in PrefsRouted.tsx
- [ ] 5.3 Verify sidebar active state works correctly when on /prefs/storage

## 6. Testing and Validation

- [ ] 6.1 Test storage path display loads current value on page load
- [ ] 6.2 Test directory picker opens when clicking "Change Path"
- [ ] 6.3 Test path update saves to backend and displays success message
- [ ] 6.4 Test error handling when backend save fails
- [ ] 6.5 Test in Electron runtime mode
- [ ] 6.6 Test in standalone runtime mode (directory picker should work via adapter)
- [ ] 6.7 Verify sidebar menu structure displays both Preferences and Application Settings groups
- [ ] 6.8 Verify navigation between General, Advanced, and Storage pages works correctly
