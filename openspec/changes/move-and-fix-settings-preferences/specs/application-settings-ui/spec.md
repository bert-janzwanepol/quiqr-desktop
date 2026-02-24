# application-settings-ui Delta Spec

This delta spec adds UI controls for five settings that were previously scattered across menus and implicit locations.

## ADDED Requirements

### Requirement: Appearance Preferences page displays view mode setting

The Preferences Appearance page SHALL display the library view mode setting control.

#### Scenario: User views Appearance Preferences page
- **WHEN** user navigates to `/prefs/general`
- **THEN** system displays the Appearance page with controls for interface style and Site Library View (sitesListingView)

#### Scenario: User changes library view mode setting
- **WHEN** user selects a different view mode option ("cards" or "list")
- **AND** user saves the preference
- **THEN** system SHALL update `sitesListingView` in the user preferences via `api.setUserPreference('sitesListingView', <value>)`
- **AND** the Site Library SHALL switch between card and list view display

### Requirement: Behaviour Preferences page displays role setting

The Preferences Behaviour page SHALL display the role setting control.

#### Scenario: User views Behaviour Preferences page
- **WHEN** user navigates to `/prefs/advanced`
- **THEN** system displays the Behaviour page with a control for role setting (applicationRole)

#### Scenario: User changes role setting
- **WHEN** user selects a different role option ("contentEditor" or "siteDeveloper")
- **AND** user saves the preference
- **THEN** system SHALL update `applicationRole` in the user preferences via `api.setUserPreference('applicationRole', <value>)`
- **AND** the workspace menu SHALL filter items and show/hide advanced features based on the new role (siteDeveloper shows all features including Sync, Site Configuration, Tools, and Site Log buttons)

### Requirement: Application Settings Feature Flags page displays experimental features

The Application Settings Feature Flags page SHALL display the experimental features toggle.

#### Scenario: User views Feature Flags page
- **WHEN** user navigates to `/prefs/appsettings-general`
- **THEN** system displays the Feature Flags page with a toggle for experimental features

#### Scenario: User enables experimental features
- **WHEN** user toggles experimental features ON
- **AND** user saves the setting
- **THEN** system SHALL update `experimentalFeatures` in instance settings via `api.setInstanceSetting('experimentalFeatures', true)`
- **AND** system SHALL rebuild the application menu to show the "Experimental" submenu
- **AND** experimental features throughout the application SHALL become available

#### Scenario: User disables experimental features
- **WHEN** user toggles experimental features OFF
- **AND** user saves the setting
- **THEN** system SHALL update `experimentalFeatures` in instance settings via `api.setInstanceSetting('experimentalFeatures', false)`
- **AND** system SHALL rebuild the application menu to hide the "Experimental" submenu
- **AND** experimental features throughout the application SHALL become unavailable

### Requirement: Application Settings Hugo page displays Hugo-specific settings

The Application Settings Hugo page SHALL display Hugo-specific configuration options.

#### Scenario: User views Application Settings Hugo page
- **WHEN** user navigates to `/prefs/hugo`
- **THEN** system displays the Application Settings Hugo page with controls for Hugo draft mode and Hugo auto serve

#### Scenario: User enables Hugo draft mode
- **WHEN** user toggles Hugo draft mode ON
- **AND** user saves the setting
- **THEN** system SHALL update `hugo.serveDraftMode` in instance settings via `api.setInstanceSetting('hugo.serveDraftMode', true)`
- **AND** Hugo serve processes SHALL include draft content when serving sites

#### Scenario: User disables Hugo auto serve
- **WHEN** user toggles Hugo auto serve OFF
- **AND** user saves the setting
- **THEN** system SHALL update `hugo.disableAutoHugoServe` in instance settings via `api.setInstanceSetting('hugo.disableAutoHugoServe', true)`
- **AND** Hugo SHALL NOT automatically start serve processes when workspaces are opened

### Requirement: Application Settings menu group includes new pages

The Application Settings menu group in the Preferences sidebar SHALL include menu items for Feature Flags and Hugo settings pages.

#### Scenario: User views Preferences sidebar
- **WHEN** user navigates to the Preferences view
- **THEN** sidebar displays the Application Settings menu group with menu items including: Storage, Git, Logging, Hugo, and Feature Flags (in that order)

#### Scenario: User clicks Feature Flags menu item
- **WHEN** user clicks "Feature Flags" in the Application Settings menu group
- **THEN** system navigates to `/prefs/appsettings-general` route and displays the Feature Flags page

#### Scenario: User clicks Hugo menu item
- **WHEN** user clicks "Hugo" in the Application Settings menu group
- **THEN** system navigates to `/prefs/hugo` route and displays the Hugo settings page

### Requirement: Settings persistence and retrieval

The system SHALL persist all five settings using the existing unified configuration API and retrieve them when rendering Preferences pages.

#### Scenario: Loading existing settings on page render
- **WHEN** user navigates to any Preferences page with these settings
- **THEN** system SHALL call appropriate API methods to retrieve current values:
  - `api.getEffectivePreference('sitesListingView')` for card view
  - `api.getEffectivePreference('applicationRole')` for role setting
  - `api.getInstanceSetting('experimentalFeatures')` for experimental features
  - `api.getInstanceSetting('hugo.serveDraftMode')` for Hugo draft mode
  - `api.getInstanceSetting('hugo.disableAutoHugoServe')` for Hugo auto serve
- **AND** system SHALL populate form controls with current values

#### Scenario: Settings update triggers application-wide refresh
- **WHEN** user saves any of these five settings
- **THEN** system SHALL update the appropriate configuration file (instance_settings.json or user_prefs_ELECTRON.json)
- **AND** affected UI components throughout the application SHALL reflect the new values without requiring application restart

## REMOVED Requirements

### Requirement: Menu-based role setting selection

**Reason:** Role setting is being moved to the Preferences UI for better discoverability and consistency.

**Migration:** Users should access role settings via Preferences > Behaviour instead of the application menu (Edit > Role). Existing `applicationRole` values in user preferences will continue to work without changes.

### Requirement: Menu-based experimental features toggle

**Reason:** Experimental features toggle is being moved to the Preferences UI for better discoverability and consistency.

**Migration:** Users should access experimental features via Application Settings > Feature Flags instead of the application menu (Edit > Enable Experimental). The conditional "Experimental" submenu (Edit > Experimental) remains and shows only when experimental features are enabled.

### Requirement: Menu-based Hugo settings controls

**Reason:** Hugo settings (Server Draft Mode, Disable Auto Serve) are being moved to the Preferences UI for better discoverability and consistency with other settings.

**Migration:** Users should access Hugo settings via Application Settings > Hugo instead of the application menu (Hugo > Server Draft Mode, Hugo > Disable Auto Serve). Existing settings in `instance_settings.json` will continue to work without changes. Menu handlers kept for backwards compatibility but deprecated.
