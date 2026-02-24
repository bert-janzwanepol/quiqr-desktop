# unified-config Delta Spec

This delta spec clarifies that certain configuration settings are now managed through the Preferences UI. No schema or API changes are required - this is purely documentation of how settings are accessed by users.

## MODIFIED Requirements

### Requirement: CONFIG-API-001 - Unified Configuration API

The system SHALL expose a unified API for reading and writing configuration that abstracts the layered resolution. Settings managed through the Preferences UI SHALL use the same API methods as programmatic access.

#### Scenario: Reading resolved preference
- **GIVEN** a configured user with layered preferences
- **WHEN** frontend calls `api.getEffectivePreference('interfaceStyle', userId)`
- **THEN** the system SHALL return the resolved value after applying all layers

#### Scenario: Writing user preference
- **GIVEN** the ELECTRON user
- **WHEN** frontend calls `api.setUserPreference('interfaceStyle', 'quiqr10-dark')`
- **THEN** the system SHALL update `user_prefs_ELECTRON.json`
- **AND** NOT modify instance settings

#### Scenario: Reading instance setting
- **GIVEN** an instance with configured storage
- **WHEN** frontend calls `api.getInstanceSetting('storage.type')`
- **THEN** the system SHALL return the instance-level setting

#### Scenario: Preferences UI uses same API as programmatic access
- **GIVEN** the Preferences UI component
- **WHEN** rendering a settings page
- **THEN** system SHALL use `api.getEffectivePreference()` or `api.getInstanceSetting()` to retrieve current values
- **WHEN** user saves a setting
- **THEN** system SHALL use `api.setUserPreference()` or `api.setInstanceSetting()` to persist the change
- **AND** the API methods SHALL provide the same behavior as if called programmatically

#### Scenario: UI-managed settings remain accessible to backend code
- **GIVEN** a setting managed through the Preferences UI (e.g., `hugo.serveDraftMode`)
- **WHEN** backend code requests this setting via UnifiedConfigService
- **THEN** system SHALL return the current value from instance_settings.json
- **AND** the value SHALL reflect any changes made through the Preferences UI

## ADDED Requirements

### Requirement: UI-managed configuration settings documentation

The system documentation SHALL clearly identify which settings are managed through the Preferences UI versus programmatic-only settings.

#### Scenario: Developer identifies where to find a setting
- **GIVEN** a developer wants to change the Hugo draft mode setting
- **WHEN** developer consults the unified-config documentation
- **THEN** documentation SHALL indicate that `hugo.serveDraftMode` is managed through Application Settings > Hugo
- **AND** documentation SHALL specify the API method for programmatic access if needed

#### Scenario: User-level vs instance-level settings distinction
- **GIVEN** the Preferences UI with multiple settings
- **WHEN** user views the settings pages
- **THEN** UI SHALL clearly distinguish user-level preferences (sitesListingView, applicationRole) from instance-level settings (experimentalFeatures, hugo.serveDraftMode, hugo.disableAutoHugoServe)
- **AND** Application Settings pages SHALL be grouped separately from User Preferences per the application-settings-ui spec
