# application-settings-ui Specification

## Purpose
TBD - created by archiving change add-application-settings-views. Update Purpose after archive.
## Requirements
### Requirement: Semantic separation of Application Settings and User Preferences

The system SHALL establish a clear UI separation between Application Settings (system-wide configuration for the Quiqr application) and Preferences (per-user settings).

**Note:** Application Settings are intended for Electron edition (single-user) and admin users in standalone edition (multi-user). This change does NOT implement access control or hiding logic - it only establishes the UI structure. Future work will add role-based access control for standalone edition.

#### Scenario: UI structure supports future access control
- **WHEN** the Preferences view is rendered
- **THEN** Application Settings appear in a separate menu group that can be conditionally hidden or restricted in future implementations

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

### Requirement: Storage settings page rendering

The system SHALL render a Storage settings page at route `/prefs/storage` within the Preferences layout.

#### Scenario: User navigates to /prefs/storage
- **WHEN** user accesses the `/prefs/storage` route
- **THEN** system displays the Storage settings view with the current storage path and controls to modify it

#### Scenario: Storage page follows Prefs layout pattern
- **WHEN** Storage page is rendered
- **THEN** page uses the same AppLayout structure as PrefsGeneral and PrefsAdvanced (consistent toolbar, styling)

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

### Requirement: Menu extensibility

The Application Settings menu group SHALL support adding additional settings pages without modifying the sidebar component's core structure.

#### Scenario: Future settings page addition
- **WHEN** a new settings page is added
- **THEN** developer can add it to the menu items array in PrefsSidebar without structural changes

