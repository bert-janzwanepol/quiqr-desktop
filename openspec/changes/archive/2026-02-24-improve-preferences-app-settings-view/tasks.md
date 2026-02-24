# Implementation Tasks

## 1. Type System Updates

- [x] 1.1 Add `customOpenCommand` to UserPreferences schema in packages/types/src/schemas/config.ts
- [x] 1.2 Verify `git.binaryPath` exists in InstanceSettings schema
- [x] 1.3 Verify `logging.retention` exists in InstanceSettings schema
- [x] 1.4 Build types package: `npm run build -w @quiqr/types`

## 2. Backend API Support

- [x] 2.1 Verify `setInstanceSetting` handler supports `git.binaryPath` in packages/backend/src/api/handlers/config-handlers.ts
- [x] 2.2 Verify `setInstanceSetting` handler supports `logging.retention`
- [x] 2.3 Add `executeCustomOpenCommand` API endpoint in config-handlers.ts
- [x] 2.4 Implement command execution logic with site path substitution
- [x] 2.5 Add error handling for invalid command paths

## 3. PrefsGeneral Updates

- [x] 3.1 Remove Quiqr Data Folder FolderPicker component from PrefsGeneral.tsx
- [x] 3.2 Remove dataFolder queries and mutations from PrefsGeneral.tsx
- [x] 3.3 Add useSnackMessage hook to PrefsGeneral.tsx
- [x] 3.4 Add snackbar success callback to interfaceStyle mutation
- [x] 3.5 Add snackbar error callback to interfaceStyle mutation
- [x] 3.6 Test interface style change shows snackbar

## 4. Custom Open Command in Preferences

- [x] 4.1 Add customOpenCommand text field to PrefsGeneral.tsx (or PrefsAdvanced.tsx)
- [x] 4.2 Add query for customOpenCommand effective preference
- [x] 4.3 Add mutation to save customOpenCommand user preference
- [x] 4.4 Add snackbar feedback for save success
- [x] 4.5 Add snackbar feedback for save error
- [x] 4.6 Add placeholder text with example command

## 5. Custom Open Command Site Tools Integration

- [x] 5.1 Add `executeCustomOpenCommand` method to packages/frontend/src/api.ts
- [x] 5.2 Find or create Site Tools component for custom open button
- [x] 5.3 Add "Open In..." button that appears when customOpenCommand is set
- [x] 5.4 Implement button click handler to call executeCustomOpenCommand API
- [x] 5.5 Add snackbar feedback for execution success
- [x] 5.6 Add snackbar feedback for execution error
- [x] 5.7 Test button visibility logic (shows/hides based on preference) - MANUALLY VERIFIED

## 6. Git Settings Page

- [x] 6.1 Create PrefsGit.tsx in packages/frontend/src/containers/Prefs/
- [x] 6.2 Add query for git.binaryPath instance setting
- [x] 6.3 Add text field for Git binary path with current value
- [x] 6.4 Add mutation to save git.binaryPath instance setting
- [x] 6.5 Add useSnackMessage hook for feedback
- [x] 6.6 Add snackbar success callback "Git binary path updated"
- [x] 6.7 Add snackbar error callback with error message
- [x] 6.8 Add informational text about empty value using system Git
- [x] 6.9 Add route `/prefs/git` to PrefsRouted.tsx

## 7. Logging Settings Page

- [x] 7.1 Create PrefsLogging.tsx in packages/frontend/src/containers/Prefs/
- [x] 7.2 Add query for logging.retention instance setting
- [x] 7.3 Add dropdown/select for log retention options (7, 30, 90, 365 days)
- [x] 7.4 Add mutation to save logging.retention instance setting
- [x] 7.5 Add useSnackMessage hook for feedback
- [x] 7.6 Add snackbar success callback "Log retention updated to {value} days"
- [x] 7.7 Add snackbar error callback with error message
- [x] 7.8 Add route `/prefs/logging` to PrefsRouted.tsx

## 8. Sidebar Menu Updates

- [x] 8.1 Add "Git" menu item to Application Settings in PrefsSidebar.tsx
- [x] 8.2 Add "Logging" menu item to Application Settings in PrefsSidebar.tsx
- [x] 8.3 Verify menu items link to correct routes
- [x] 8.4 Test active state indication for Git and Logging pages - MANUALLY VERIFIED

## 9. Frontend Query Options

- [x] 9.1 Add query options for git.binaryPath in packages/frontend/src/queries/options.ts
- [x] 9.2 Add query options for logging.retention in queries/options.ts
- [x] 9.3 Add query options for customOpenCommand effective preference
- [x] 9.4 Add mutation options for customOpenCommand save
- [x] 9.5 Add mutation options for executeCustomOpenCommand

## 10. Testing - PrefsGeneral

- [x] 10.1 Add test for PrefsGeneral rendering without dataFolder field - COMPLETED
- [x] 10.2 Add test for interface style change showing success snackbar - COMPLETED
- [x] 10.3 Add test for interface style change showing error snackbar on failure - COMPLETED
- [x] 10.4 Add test for customOpenCommand field rendering - COMPLETED
- [x] 10.5 Add test for customOpenCommand save with snackbar feedback - COMPLETED

## 11. Testing - PrefsGit

- [x] 11.1 Add test file for PrefsGit.tsx - COMPLETED
- [x] 11.2 Add test for PrefsGit rendering with current git.binaryPath value - COMPLETED
- [x] 11.3 Add test for saving git.binaryPath shows success snackbar - COMPLETED
- [x] 11.4 Add test for saving git.binaryPath shows error snackbar on failure - COMPLETED

## 12. Testing - PrefsLogging

- [x] 12.1 Add test file for PrefsLogging.tsx - COMPLETED
- [x] 12.2 Add test for PrefsLogging rendering with current logging.retention value - COMPLETED
- [x] 12.3 Add test for saving logging.retention shows success snackbar - COMPLETED
- [x] 12.4 Add test for saving logging.retention shows error snackbar on failure - COMPLETED

## 13. Testing - Custom Open Command

- [x] 13.1 Add test for "Open In..." button visibility (shown when command set) - COMPLETED
- [x] 13.2 Add test for "Open In..." button hidden when no command - COMPLETED
- [x] 13.3 Add test for executeCustomOpenCommand success shows snackbar - COMPLETED
- [x] 13.4 Add test for executeCustomOpenCommand error shows snackbar - COMPLETED
- [x] 13.5 Add backend test for executeCustomOpenCommand API endpoint - COMPLETED

## 14. Testing - Sidebar and Navigation

- [x] 14.1 Add test for PrefsSidebar includes Git and Logging menu items - COMPLETED
- [x] 14.2 Add test for Git menu item active state on /prefs/git - COMPLETED
- [x] 14.3 Add test for Logging menu item active state on /prefs/logging - COMPLETED
- [x] 14.4 Add test for navigation to /prefs/git route - COMPLETED
- [x] 14.5 Add test for navigation to /prefs/logging route - COMPLETED

## 15. Integration Testing

- [x] 15.1 Manual test: Remove dataFolder, verify no errors - COMPLETED
- [x] 15.2 Manual test: Change interface style, verify snackbar appears - COMPLETED
- [x] 15.3 Manual test: Set custom open command, save, verify persistence - COMPLETED
- [x] 15.4 Manual test: Open site with custom command button - COMPLETED
- [x] 15.5 Manual test: Navigate to Git settings, change path, verify snackbar - COMPLETED
- [x] 15.6 Manual test: Navigate to Logging settings, change retention, verify snackbar - COMPLETED
- [x] 15.7 Run full test suite: `npm run test` - COMPLETED (608 tests pass, all tests passing)
- [x] 15.8 Run type checking: `cd packages/frontend && npx tsc --noEmit` - COMPLETED (unrelated errors exist, our changes type-check correctly)

## 16. Cleanup and Documentation

- [x] 16.1 Remove any dead code related to old dataFolder handling - COMPLETED (verified with grep)
- [x] 16.2 Verify all console.log/debug statements removed - COMPLETED (verified with grep)
- [~] 16.3 Update CHANGELOG if applicable - DEFERRED (no CHANGELOG maintained in project)
- [x] 16.4 Verify all imports are correct and no unused imports remain - COMPLETED (verified)
