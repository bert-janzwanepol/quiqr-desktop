# user-feedback Delta Specification

## ADDED Requirements

### Requirement: Interface Style Change Feedback

The system SHALL display a snackbar message when the interface style user preference is changed.

#### Scenario: User changes interface style to dark
- **WHEN** user changes interface style from light to dark
- **AND** save operation succeeds
- **THEN** system SHALL display success snackbar "Interface style changed to quiqr10-dark"

#### Scenario: User changes interface style to light
- **WHEN** user changes interface style from dark to light
- **AND** save operation succeeds
- **THEN** system SHALL display success snackbar "Interface style changed to quiqr10-light"

#### Scenario: Interface style change fails
- **WHEN** user changes interface style
- **AND** save operation fails
- **THEN** system SHALL display error snackbar "Failed to change interface style: {error.message}"

### Requirement: Custom Open Command Feedback

The system SHALL display snackbar messages for all custom open command operations (save and execute).

#### Scenario: Custom command saved successfully
- **WHEN** user saves custom open command preference
- **AND** operation succeeds
- **THEN** system SHALL display success snackbar "Custom open command saved"

#### Scenario: Custom command save fails
- **WHEN** user saves custom open command preference
- **AND** operation fails
- **THEN** system SHALL display error snackbar "Failed to save custom open command: {error.message}"

#### Scenario: Custom command cleared successfully
- **WHEN** user clears custom open command preference
- **AND** operation succeeds
- **THEN** system SHALL display success snackbar "Custom open command cleared"

#### Scenario: Custom command executed successfully
- **WHEN** user clicks "Open In..." button to open site with custom command
- **AND** operation succeeds
- **THEN** system SHALL display success snackbar "Opened site in {command}"

#### Scenario: Custom command execution fails
- **WHEN** user clicks "Open In..." button
- **AND** operation fails
- **THEN** system SHALL display error snackbar "Failed to open site: {error.message}"

### Requirement: Git Settings Change Feedback

The system SHALL display snackbar messages when Git instance settings are changed.

#### Scenario: Git binary path updated successfully
- **WHEN** user updates Git binary path instance setting
- **AND** operation succeeds
- **THEN** system SHALL display success snackbar "Git binary path updated"

#### Scenario: Git binary path update fails
- **WHEN** user updates Git binary path instance setting
- **AND** operation fails
- **THEN** system SHALL display error snackbar "Failed to update Git binary path: {error.message}"

### Requirement: Logging Settings Change Feedback

The system SHALL display snackbar messages when logging instance settings are changed.

#### Scenario: Log retention updated successfully
- **WHEN** user updates log retention instance setting
- **AND** operation succeeds
- **THEN** system SHALL display success snackbar "Log retention updated to {value} days"

#### Scenario: Log retention update fails
- **WHEN** user updates log retention instance setting
- **AND** operation fails
- **THEN** system SHALL display error snackbar "Failed to update log retention: {error.message}"

## REMOVED Requirements

### Requirement: Quiqr Data Folder Feedback

**Reason**: The "Quiqr Data Folder" user preference has been removed from PrefsGeneral as it was replaced by the unified-config storage.dataFolder instance setting (configured in Application Settings → Storage).

**Migration**: No user action required. Storage path configuration moved to Application Settings → Storage page which has its own feedback implementation.
