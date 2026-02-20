## ADDED Requirements

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
- **THEN** sidebar displays two menu groups: "Preferences" (with General and Advanced items) and "Application Settings" (with Storage item)

#### Scenario: User clicks Storage menu item
- **WHEN** user clicks "Storage" in the Application Settings menu group
- **THEN** system navigates to `/prefs/storage` route and displays the Storage settings page

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

### Requirement: Menu extensibility

The Application Settings menu group SHALL support adding additional settings pages without modifying the sidebar component's core structure.

#### Scenario: Future settings page addition
- **WHEN** a new settings page is added
- **THEN** developer can add it to the menu items array in PrefsSidebar without structural changes
