# application-settings-ui Delta Specification

## MODIFIED Requirements

### Requirement: Application Settings section in Preferences sidebar

The Preferences sidebar SHALL display a separate "Application Settings" menu group distinct from the existing "Preferences" menu group.

#### Scenario: User views Preferences sidebar
- **WHEN** user navigates to the Preferences view
- **THEN** sidebar displays two menu groups: "Preferences" (with General and Advanced items) and "Application Settings" (with Storage, Git, and Logging items)

#### Scenario: User clicks Storage menu item
- **WHEN** user clicks "Storage" in the Application Settings menu group
- **THEN** system navigates to `/prefs/storage` route and displays the Storage settings page

#### Scenario: User clicks Git menu item
- **WHEN** user clicks "Git" in the Application Settings menu group
- **THEN** system navigates to `/prefs/git` route and displays the Git settings page

#### Scenario: User clicks Logging menu item
- **WHEN** user clicks "Logging" in the Application Settings menu group
- **THEN** system navigates to `/prefs/logging` route and displays the Logging settings page

### Requirement: Menu active state indication

The system SHALL indicate the active menu item in the Application Settings menu group.

#### Scenario: User is on Storage page
- **WHEN** user is viewing `/prefs/storage`
- **THEN** "Storage" menu item displays as active in the sidebar

#### Scenario: User is on Git page
- **WHEN** user is viewing `/prefs/git`
- **THEN** "Git" menu item displays as active in the sidebar

#### Scenario: User is on Logging page
- **WHEN** user is viewing `/prefs/logging`
- **THEN** "Logging" menu item displays as active in the sidebar

## ADDED Requirements

### Requirement: Git settings page rendering

The system SHALL render a Git settings page at route `/prefs/git` within the Preferences layout.

#### Scenario: User navigates to /prefs/git
- **WHEN** user accesses the `/prefs/git` route
- **THEN** system displays the Git settings view with Git configuration options

#### Scenario: Git page follows Prefs layout pattern
- **WHEN** Git page is rendered
- **THEN** page uses the same AppLayout structure as PrefsGeneral and PrefsAdvanced (consistent toolbar, styling)

### Requirement: Logging settings page rendering

The system SHALL render a Logging settings page at route `/prefs/logging` within the Preferences layout.

#### Scenario: User navigates to /prefs/logging
- **WHEN** user accesses the `/prefs/logging` route
- **THEN** system displays the Logging settings view with logging configuration options

#### Scenario: Logging page follows Prefs layout pattern
- **WHEN** Logging page is rendered
- **THEN** page uses the same AppLayout structure as PrefsGeneral and PrefsAdvanced (consistent toolbar, styling)
