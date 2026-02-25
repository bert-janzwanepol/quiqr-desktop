## ADDED Requirements

### Requirement: OpenSpec Badge Generation in Deploy Workflow
The deploy workflow SHALL generate OpenSpec metric badges (number of specs and tasks status) using the wearetechnative/openspec-badge-action in the coverage job after the coverage badge generation step.

#### Scenario: Badge generation on main branch push
- **WHEN** code is pushed to main branch and coverage job completes
- **THEN** the workflow SHALL invoke openspec-badge-action with metric_types="number_of_specs,tasks_status", badge_style="classic", and show_label=true
- **AND** the step SHALL run after the coverage badge step but before the publish-openspec job

#### Scenario: Badge files published to gh-pages
- **WHEN** badge generation completes successfully
- **THEN** badge SVG files SHALL be written to the gh-pages branch at badges/number_of_specs.svg and badges/tasks_status.svg
- **AND** existing badges (coverage.svg) SHALL NOT be affected

#### Scenario: Badge generation failure is non-blocking
- **WHEN** OpenSpec badge generation fails
- **THEN** the workflow SHALL log the error
- **AND** the workflow SHALL continue with the publish-openspec job
- **AND** the deployment SHALL NOT be blocked

### Requirement: OpenSpec Badge Action Configuration
The openspec-badge-action step SHALL use classic badge style with labels enabled to maintain visual consistency with existing badges.

#### Scenario: Classic style with labels
- **WHEN** badges are generated
- **THEN** both badges SHALL use badge_style="classic" (gradient appearance)
- **AND** both badges SHALL use show_label=true to display "OpenSpec" prefix
- **AND** badge style SHALL match existing coverage badge style

#### Scenario: Two metric types generated
- **WHEN** badges are generated
- **THEN** the action SHALL create a badge for "number_of_specs" showing total specification count
- **AND** the action SHALL create a badge for "tasks_status" showing open/total tasks ratio

### Requirement: Badge Coexistence with Existing CI Resources
The OpenSpec badge generation SHALL NOT interfere with existing GitHub Pages deployments including coverage badges, OpenSpec UI, Docusaurus documentation, or any other resources.

#### Scenario: Coverage badge preservation
- **WHEN** OpenSpec badges are generated
- **THEN** the existing coverage badge at badges/coverage.svg SHALL remain accessible
- **AND** coverage badge workflow behavior SHALL NOT change
- **AND** coverage badge updates SHALL continue to work as specified in existing ci-automation spec

#### Scenario: OpenSpec UI deployment unaffected
- **WHEN** publish-openspec job runs after badge generation
- **THEN** the publish-openspec job SHALL preserve all badge files in badges/ directory
- **AND** OpenSpec UI SHALL be deployed to /specs/ path as specified in existing ci-automation spec
- **AND** badge files SHALL be fetched from gh-pages and copied to combined output as per existing workflow

#### Scenario: Documentation deployment unaffected
- **WHEN** publish-openspec job combines artifacts for deployment
- **THEN** Docusaurus documentation at /docs/ path SHALL NOT be affected
- **AND** all three resources (/docs/, /specs/, /badges/) SHALL coexist correctly
- **AND** path-based routing SHALL continue to work as specified in existing ci-automation spec

#### Scenario: Workflow permissions unchanged
- **WHEN** OpenSpec badge generation step runs
- **THEN** the step SHALL use existing workflow permissions (default GITHUB_TOKEN with write access)
- **AND** no additional permissions SHALL be required beyond what coverage badge already uses
- **AND** the permissions model specified in existing ci-automation spec SHALL remain valid
