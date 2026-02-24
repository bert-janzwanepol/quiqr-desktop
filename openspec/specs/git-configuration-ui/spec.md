# Git Configuration UI

**Capability:** `git-configuration-ui`
**Status:** Active
**Owner:** frontend

## Purpose

This spec defines the UI for configuring Git-related instance settings, specifically the path to the Git binary used by Quiqr for Git operations.

## Requirements

### Requirement: Git Settings Page in Application Settings

The system SHALL provide a Git settings page accessible at route `/prefs/git` within the Preferences layout under the Application Settings menu group.

#### Scenario: User navigates to Git settings
- **WHEN** user clicks "Git" in Application Settings menu
- **THEN** system navigates to `/prefs/git` route
- **AND** displays Git configuration page with Application Settings layout

#### Scenario: Git settings page displays current binary path
- **WHEN** Git settings page is rendered
- **THEN** system displays the current value of `git.binaryPath` instance setting
- **AND** provides an input field to modify the path

### Requirement: Git Binary Path Configuration

The system SHALL allow users to view and modify the Git binary path instance setting through the Git settings page.

#### Scenario: User updates Git binary path
- **WHEN** user enters a new path in the Git binary path field
- **AND** user saves the setting
- **THEN** system SHALL call `setInstanceSetting('git.binaryPath', newPath)`
- **AND** display success snackbar message "Git binary path updated"
- **AND** persist the value to `instance_settings.json`

#### Scenario: User updates Git binary path with error
- **WHEN** user saves an invalid Git binary path
- **AND** the backend operation fails
- **THEN** system SHALL display error snackbar "Failed to update Git binary path: {error message}"
- **AND** preserve the previous valid value

#### Scenario: Empty Git binary path uses system default
- **WHEN** Git binary path field is empty or cleared
- **THEN** system SHALL use the system Git binary (from PATH)
- **AND** display informational text "Using system Git binary"

### Requirement: User Feedback for Git Settings Changes

All Git settings changes SHALL display snackbar messages conforming to the user-feedback spec.

#### Scenario: Success message shows on save
- **WHEN** user successfully saves Git binary path
- **THEN** system SHALL display success snackbar with message "Git binary path updated"

#### Scenario: Error message shows on failure
- **WHEN** Git binary path save operation fails
- **THEN** system SHALL display error snackbar with message "Failed to update Git binary path: {error.message}"

### Requirement: Git Settings Menu Item

The PrefsSidebar SHALL include a "Git" menu item in the Application Settings menu group.

#### Scenario: Git menu item appears in sidebar
- **WHEN** user views Preferences sidebar
- **THEN** "Git" menu item appears under Application Settings menu group
- **AND** clicking it navigates to `/prefs/git`

#### Scenario: Git menu item shows active state
- **WHEN** user is viewing `/prefs/git` route
- **THEN** "Git" menu item displays as active in the sidebar

## Cross-References

- **unified-config**: Instance settings API (getInstanceSetting, setInstanceSetting)
- **user-feedback**: Snackbar message requirements
- **application-settings-ui**: Application Settings menu structure
