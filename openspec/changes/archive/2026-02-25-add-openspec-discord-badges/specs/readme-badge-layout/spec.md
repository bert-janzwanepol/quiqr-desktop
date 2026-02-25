## ADDED Requirements

### Requirement: OpenSpec badges placement in README
The README SHALL display two OpenSpec badges (specs count and tasks status) immediately after the License badge in the header badge section.

#### Scenario: Badge ordering after License
- **WHEN** README header is rendered
- **THEN** badges SHALL appear in order: Deploy Status, Coverage, Version, License, OpenSpec Specs, OpenSpec Tasks, Discord

#### Scenario: Badge linking to OpenSpec UI
- **WHEN** user clicks either OpenSpec badge
- **THEN** browser SHALL navigate to https://quiqr.github.io/quiqr-desktop/specs

#### Scenario: OpenSpec badges use classic style
- **WHEN** OpenSpec badges are displayed
- **THEN** both SHALL use classic (gradient) style with "OpenSpec" label visible

### Requirement: Discord badge placement in README
The README SHALL display a Discord online users badge immediately after the OpenSpec badges in the header badge section.

#### Scenario: Discord badge shows online members
- **WHEN** Discord badge is rendered
- **THEN** badge SHALL display current online member count from server invite nJ2JH7jvmV using shields.io Discord API

#### Scenario: Discord badge linking
- **WHEN** user clicks Discord badge
- **THEN** browser SHALL navigate to https://discord.gg/nJ2JH7jvmV

#### Scenario: Discord badge uses classic style
- **WHEN** Discord badge is displayed
- **THEN** badge SHALL use classic style consistent with other badges

### Requirement: Remove redundant navigation links
The README SHALL remove the textual navigation links to "Discord" and "OpenSpec UI" from the paragraph element below the logo (lines 10-11).

#### Scenario: Navigation paragraph cleanup
- **WHEN** README is rendered after changes
- **THEN** the navigation paragraph SHALL contain only "Website" and "Documentation" links

#### Scenario: Discord link preserved in Support section
- **WHEN** user views Support and Questions section (line 69)
- **THEN** the Discord markdown link SHALL remain unchanged

### Requirement: Badge image source URLs
OpenSpec badges SHALL reference the GitHub Pages hosted badge files, while Discord badge SHALL use shields.io API.

#### Scenario: OpenSpec badge URLs
- **WHEN** OpenSpec badges are loaded
- **THEN** specs badge SHALL use https://quiqr.github.io/quiqr-desktop/badges/number_of_specs.svg
- **THEN** tasks badge SHALL use https://quiqr.github.io/quiqr-desktop/badges/tasks_status.svg

#### Scenario: Discord badge URL
- **WHEN** Discord badge is loaded
- **THEN** badge SHALL use https://img.shields.io/discord/{SERVER_ID}?style=flat&logo=discord with SERVER_ID extracted from invite code nJ2JH7jvmV
