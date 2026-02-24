## Why

The recent unify-configuration-architecture change fundamentally restructured how settings are stored and accessed (user preferences vs instance settings). The Preferences UI is now outdated, showing removed settings (Quiqr Data Folder), lacking proper user feedback for changes (Interface Style), and placing settings in incorrect categories (Git binary path, Log Retention in user prefs instead of instance settings). This misalignment creates confusion and blocks proper configuration management.

## What Changes

- Remove "Quiqr Data Folder" setting from Preferences→General (now obsolete, replaced by unified config storage)
- Add snackbar feedback when Interface Style preference is changed by user
- Ensure "Custom Open-In Command" persists to user preferences and generates appropriate user feedback
- Add button in Site Tools section to open sites with custom open-in command
- Move "Path to Git Binary" from user preferences to instance settings under new Application Settings→Git menu item
- Move "Log Retention" from user preferences to instance settings under new Application Settings→Logging menu item
- All settings changes SHALL provide user feedback per user-feedback spec
- Add missing test coverage for settings views and settings update flows

## Capabilities

### New Capabilities
- `git-configuration-ui`: Settings UI for Git-related instance configuration (path to binary)
- `logging-configuration-ui`: Settings UI for logging-related instance configuration (log retention)
- `custom-open-command`: User preference and integration for opening sites with custom external command

### Modified Capabilities
- `application-settings-ui`: Add Git and Logging menu items to Application Settings menu group
- `user-feedback`: Apply to all settings changes (interface style, custom open command, git path, log retention)

## Impact

**Frontend:**
- `packages/frontend/src/containers/Prefs/PrefsGeneral.tsx` - Remove Quiqr Data Folder field, add snackbar for Interface Style
- `packages/frontend/src/containers/Prefs/PrefsSidebar.tsx` - Add Git and Logging to Application Settings menu
- `packages/frontend/src/containers/Prefs/` - New PrefsGit.tsx and PrefsLogging.tsx components
- Site tools components - Add button for custom open-in command

**Backend:**
- `packages/backend/src/api/handlers/config-handlers.ts` - Ensure Git path and Log Retention use instance settings API
- Verify custom open-in command uses user preferences storage

**Types:**
- `packages/types/src/schemas/config.ts` - Verify instance settings schema includes git.binaryPath and logging.retention

**Testing:**
- Add tests for settings views (PrefsGeneral, PrefsGit, PrefsLogging)
- Add tests for settings update mutations and user feedback
- Add tests for custom open-in command integration

## Non-goals

- Implementing access control for Application Settings (deferred to multi-user features)
- Migrating existing user preferences to new structure (unified config handled that)
- Adding new configuration options beyond reorganizing existing ones
