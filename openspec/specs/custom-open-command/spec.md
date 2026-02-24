# Custom Open Command

**Capability:** `custom-open-command`
**Status:** Active
**Owner:** frontend, backend

## Purpose

This spec defines the user preference and UI integration for opening sites with a custom external command, allowing users to configure their preferred editor or tool for site management.

## Requirements

### Requirement: Custom Open-In Command User Preference

The system SHALL store a custom open-in command as a user preference that persists across sessions.

#### Scenario: User sets custom open command
- **WHEN** user enters a custom command in preferences
- **AND** saves the setting
- **THEN** system SHALL call `setUserPreference('customOpenCommand', command)`
- **AND** persist the value to `user_prefs_ELECTRON.json`
- **AND** display success snackbar "Custom open command saved"

#### Scenario: User clears custom open command
- **WHEN** user clears the custom command field
- **AND** saves the setting
- **THEN** system SHALL call `setUserPreference('customOpenCommand', undefined)`
- **AND** display success snackbar "Custom open command cleared"

#### Scenario: Custom open command is user-specific
- **WHEN** custom open command is saved
- **THEN** system SHALL store it in user preferences (not instance settings)
- **AND** different users can have different commands

### Requirement: Custom Open Command Configuration UI

The system SHALL provide a text field in Preferences for configuring the custom open-in command.

#### Scenario: User views custom command field
- **WHEN** user views Preferences (General or Advanced)
- **THEN** system displays a text field labeled "Custom Open-In Command"
- **AND** shows current value from `getEffectivePreference('customOpenCommand')`
- **AND** provides placeholder text with example command

#### Scenario: User saves custom command with success feedback
- **WHEN** user enters a command and saves
- **THEN** system SHALL display success snackbar "Custom open command saved"

#### Scenario: User saves custom command with error feedback
- **WHEN** save operation fails
- **THEN** system SHALL display error snackbar "Failed to save custom open command: {error.message}"

### Requirement: Site Tools Open-In Button

The system SHALL display an "Open In..." button in the Site Tools section when a custom open command is configured.

#### Scenario: Button appears when command is configured
- **WHEN** user has set a custom open command preference
- **AND** user views Site Tools section
- **THEN** system displays "Open In..." button
- **AND** button label reflects the configured command if identifiable

#### Scenario: Button hidden when no command configured
- **WHEN** user has NOT set a custom open command
- **THEN** "Open In..." button SHALL NOT appear in Site Tools

#### Scenario: User clicks open-in button
- **WHEN** user clicks "Open In..." button for a site
- **THEN** system SHALL call backend API `executeCustomOpenCommand(siteKey, customCommand)`
- **AND** display success snackbar "Opened site in {command}"

#### Scenario: Open-in command execution fails
- **WHEN** backend fails to execute the custom command
- **THEN** system SHALL display error snackbar "Failed to open site: {error.message}"

### Requirement: Backend Custom Command Execution

The system SHALL provide a backend API endpoint to execute the custom open command with the site path.

#### Scenario: Backend executes custom command
- **WHEN** `executeCustomOpenCommand(siteKey, command)` is called
- **THEN** system SHALL resolve site path from siteKey
- **AND** execute command with site path as argument (e.g., `{command} {sitePath}`)
- **AND** return success response

#### Scenario: Command execution with invalid path
- **WHEN** custom command references non-existent binary
- **THEN** system SHALL return error response
- **AND** include error message for user feedback

#### Scenario: Command supports variable substitution
- **WHEN** custom command contains `{sitePath}` placeholder
- **THEN** system SHALL replace placeholder with actual site path
- **AND** execute the expanded command

### Requirement: User Feedback for Custom Open Command

All custom open command operations SHALL display snackbar messages conforming to the user-feedback spec.

#### Scenario: Success feedback for save
- **WHEN** user saves custom open command preference
- **THEN** system SHALL display success snackbar "Custom open command saved"

#### Scenario: Success feedback for execution
- **WHEN** custom command executes successfully
- **THEN** system SHALL display success snackbar "Opened site in {command}"

#### Scenario: Error feedback for execution failure
- **WHEN** custom command execution fails
- **THEN** system SHALL display error snackbar "Failed to open site: {error.message}"

## Cross-References

- **unified-config**: User preferences API (getEffectivePreference, setUserPreference)
- **user-feedback**: Snackbar message requirements
- **backend-architecture**: Backend API endpoint pattern
