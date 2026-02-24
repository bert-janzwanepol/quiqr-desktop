# Logging Configuration UI

**Capability:** `logging-configuration-ui`
**Status:** New
**Owner:** frontend

## Purpose

This spec defines the UI for configuring logging-related instance settings, specifically the log retention period used by Quiqr for managing log files.

## ADDED Requirements

### Requirement: Logging Settings Page in Application Settings

The system SHALL provide a Logging settings page accessible at route `/prefs/logging` within the Preferences layout under the Application Settings menu group.

#### Scenario: User navigates to Logging settings
- **WHEN** user clicks "Logging" in Application Settings menu
- **THEN** system navigates to `/prefs/logging` route
- **AND** displays Logging configuration page with Application Settings layout

#### Scenario: Logging settings page displays current retention value
- **WHEN** Logging settings page is rendered
- **THEN** system displays the current value of `logging.retention` instance setting
- **AND** provides a control to modify the retention period

### Requirement: Log Retention Configuration

The system SHALL allow users to view and modify the log retention period instance setting through the Logging settings page.

#### Scenario: User updates log retention period
- **WHEN** user selects a new log retention value (e.g., 7 days, 30 days, 90 days)
- **AND** user saves the setting
- **THEN** system SHALL call `setInstanceSetting('logging.retention', newValue)`
- **AND** display success snackbar message "Log retention updated to {value} days"
- **AND** persist the value to `instance_settings.json`

#### Scenario: User updates log retention with error
- **WHEN** user saves log retention setting
- **AND** the backend operation fails
- **THEN** system SHALL display error snackbar "Failed to update log retention: {error message}"
- **AND** preserve the previous valid value

#### Scenario: Log retention options are predefined
- **WHEN** Logging settings page is rendered
- **THEN** system SHALL provide predefined retention options (7, 30, 90, 365 days)
- **AND** allow custom value input if supported

### Requirement: User Feedback for Logging Settings Changes

All Logging settings changes SHALL display snackbar messages conforming to the user-feedback spec.

#### Scenario: Success message shows on save
- **WHEN** user successfully saves log retention setting
- **THEN** system SHALL display success snackbar with message "Log retention updated to {value} days"

#### Scenario: Error message shows on failure
- **WHEN** log retention save operation fails
- **THEN** system SHALL display error snackbar with message "Failed to update log retention: {error.message}"

### Requirement: Logging Settings Menu Item

The PrefsSidebar SHALL include a "Logging" menu item in the Application Settings menu group.

#### Scenario: Logging menu item appears in sidebar
- **WHEN** user views Preferences sidebar
- **THEN** "Logging" menu item appears under Application Settings menu group
- **AND** clicking it navigates to `/prefs/logging`

#### Scenario: Logging menu item shows active state
- **WHEN** user is viewing `/prefs/logging` route
- **THEN** "Logging" menu item displays as active in the sidebar

## Cross-References

- **unified-config**: Instance settings API (getInstanceSetting, setInstanceSetting)
- **user-feedback**: Snackbar message requirements
- **application-settings-ui**: Application Settings menu structure
