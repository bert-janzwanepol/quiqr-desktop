## ADDED Requirements

**Note:** Storage path is an application-level setting (system-wide configuration in `AppConfig`), not a per-user preference. It affects the entire Quiqr application instance. In Electron edition (single-user), it's fully editable. In standalone edition (multi-user), it should eventually be admin-only. This change does NOT implement access restrictions - it only provides the UI functionality.

### Requirement: Display current storage path

The Storage settings page SHALL display the current storage path value from `AppConfig.prefs.dataFolder`.

#### Scenario: Storage page loads
- **WHEN** user navigates to the Storage settings page
- **THEN** system displays the current value of `AppConfig.prefs.dataFolder` in a read-only text field

#### Scenario: Storage path not yet set
- **WHEN** `AppConfig.prefs.dataFolder` is null or undefined
- **THEN** system displays the default value `~/Quiqr`

### Requirement: Storage path modification interface

The system SHALL provide a button to open a directory picker dialog for changing the storage path.

#### Scenario: User clicks Change Path button in Electron mode
- **WHEN** user clicks "Change Path" or "Browse" button in Electron runtime
- **THEN** system opens a native directory selection dialog

#### Scenario: User clicks Change Path button in standalone mode
- **WHEN** user clicks "Change Path" button in standalone runtime
- **THEN** system opens an appropriate directory selection mechanism (browser-based or text input fallback)

#### Scenario: User selects a new directory
- **WHEN** user selects a directory from the picker and confirms
- **THEN** system updates the displayed path in the text field

### Requirement: Storage path persistence

The system SHALL save the modified storage path to `AppConfig.prefs.dataFolder` and persist it to the config file.

#### Scenario: User confirms path change
- **WHEN** user selects a new directory and the change is applied
- **THEN** system calls a backend API to update `AppConfig.prefs.dataFolder` and saves the config file

#### Scenario: Path save succeeds
- **WHEN** backend successfully saves the new storage path
- **THEN** system displays a success notification to the user

#### Scenario: Path save fails
- **WHEN** backend fails to save the new storage path (e.g., permissions error)
- **THEN** system displays an error message and retains the previous path value

### Requirement: Storage path API endpoints

The backend SHALL expose API endpoints for reading and writing the storage path.

#### Scenario: GET storage path request
- **WHEN** frontend requests `GET /api/storage-path`
- **THEN** backend responds with JSON containing the current storage path from `AppConfig.prefs.dataFolder`
- **THEN** response conforms to Zod schema `apiSchemas.getStoragePathResponse`

#### Scenario: POST storage path request
- **WHEN** frontend sends `POST /api/storage-path` with `{ path: string }` in request body
- **THEN** backend validates the request against Zod schema `apiSchemas.setStoragePathRequest`
- **THEN** backend updates `AppConfig.prefs.dataFolder` with the new path
- **THEN** backend saves the config file
- **THEN** backend responds with success status and updated path

#### Scenario: Invalid storage path request
- **WHEN** frontend sends malformed request to `POST /api/storage-path`
- **THEN** backend responds with 400 Bad Request and Zod validation error details

### Requirement: Zod schemas for storage path API

The system SHALL define Zod schemas for storage path API requests and responses in `packages/types/src/schemas/api.ts`.

#### Scenario: Storage path request schema definition
- **WHEN** developer imports `apiSchemas` from types package
- **THEN** schemas include `setStoragePathRequest` with `path: z.string()`

#### Scenario: Storage path response schema definition
- **WHEN** developer imports `apiSchemas` from types package
- **THEN** schemas include `getStoragePathResponse` with `path: z.string()`

### Requirement: Restart advisory for path changes

The system SHALL inform users that storage path changes may require an application restart to take full effect.

#### Scenario: User successfully changes storage path
- **WHEN** backend confirms storage path update
- **THEN** system displays a message indicating "Storage path updated. Restart may be required for changes to take effect."
