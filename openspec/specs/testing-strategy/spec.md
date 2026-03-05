# Testing Strategy Specification

## Purpose

This specification defines the testing strategy for Quiqr Desktop, establishing when and how to write different types of tests for a cross-platform Electron application with SSG provider integrations, file system operations, and React components. It prioritizes behavioral testing over implementation testing to ensure high-value, maintainable test coverage.

## Requirements

### Requirement: Test Type Selection Based on Scope

The system SHALL use specific test types based on the scope and complexity of functionality being tested.

#### Scenario: Pure function testing
- **WHEN** implementing or modifying pure functions (utilities, parsers, path handlers)
- **THEN** unit tests SHALL be written using Vitest
- **AND** tests SHALL cover all edge cases and error conditions
- **AND** tests SHALL not mock internal dependencies

#### Scenario: React component testing
- **WHEN** implementing or modifying React components
- **THEN** unit tests SHALL be written using React Testing Library
- **AND** tests SHALL mock external dependencies (APIs, services)
- **AND** tests SHALL test all component states: error, loading/pending, and success
- **AND** tests SHALL use realistic user interactions via @testing-library/user-event

#### Scenario: Service integration testing
- **WHEN** implementing API handlers, service coordination, or SSG provider interfaces
- **THEN** integration tests SHALL be written using Vitest
- **AND** tests SHALL use real service instances with mocked external dependencies
- **AND** tests SHALL verify behavioral contracts between components

#### Scenario: Critical workflow testing
- **WHEN** implementing features that span the full user journey (import → edit → build → deploy)
- **THEN** E2E tests SHALL be written using Playwright
- **AND** tests SHALL be limited to critical workflows only
- **AND** tests SHALL test cross-platform behaviors when platform-specific

### Requirement: SSG Provider Testing Standards

All SSG providers SHALL implement consistent testing patterns to ensure reliability across Hugo, Jekyll, Eleventy, and future providers.

#### Scenario: Provider interface compliance
- **WHEN** implementing a new SSG provider
- **THEN** the provider SHALL pass interface compliance tests
- **AND** tests SHALL verify all required methods are implemented
- **AND** tests SHALL verify detection logic returns valid confidence levels
- **AND** tests SHALL verify metadata is complete and unique

#### Scenario: Provider behavioral testing
- **WHEN** testing SSG provider functionality
- **THEN** tests SHALL verify actual provider behavior, not mocked responses
- **AND** tests SHALL use mock dependencies for external services only
- **AND** tests SHALL test error conditions and graceful degradation

#### Scenario: Multi-provider workflow testing
- **WHEN** implementing features that work across multiple SSG providers
- **THEN** E2E tests SHALL verify functionality with at least two different providers
- **AND** tests SHALL verify provider detection and switching works correctly

### Requirement: Cross-Platform Path Testing

All path-handling code SHALL be tested across Windows and Unix-style path formats to prevent platform-specific bugs.

#### Scenario: Path normalization testing
- **WHEN** implementing path handling utilities
- **THEN** tests SHALL include both Windows (backslash, drive letters) and Unix (forward slash) path formats
- **AND** tests SHALL verify case handling for drive letters on Windows
- **AND** tests SHALL use parameterized tests for different platform scenarios

#### Scenario: File system integration testing
- **WHEN** testing file operations for community templates or local projects
- **THEN** integration tests MAY use real file system operations with temporary directories
- **AND** tests SHALL clean up all created files and directories
- **AND** unit tests SHALL mock file system operations for business logic

### Requirement: Test Anti-Patterns Prevention

Tests SHALL avoid common anti-patterns that provide low value and create maintenance burden.

#### Scenario: Mocked value testing prevention
- **WHEN** writing tests that use mocks
- **THEN** tests SHALL NOT simply verify that mocked functions return mocked values
- **AND** tests SHALL verify actual behavior changes based on different inputs
- **AND** mocks SHALL only be used for external dependencies, not internal logic

#### Scenario: Implementation detail testing prevention
- **WHEN** writing tests for React components or services
- **THEN** tests SHALL NOT test internal state management or implementation details
- **AND** tests SHALL focus on observable behavior and user-facing functionality
- **AND** refactoring code should not require test changes unless behavior changes

#### Scenario: Library behavior testing prevention
- **WHEN** using external libraries (React, Express, Electron)
- **THEN** tests SHALL NOT test that the library functions correctly
- **AND** tests SHALL focus on how the application uses the library
- **AND** tests SHALL focus on application-specific logic built on top of libraries

### Requirement: TanStack Query State Testing

Components using TanStack Query SHALL have comprehensive state testing covering all query states.

#### Scenario: Query loading state testing
- **WHEN** implementing components that use TanStack Query
- **THEN** tests SHALL verify loading state display
- **AND** tests SHALL use query client mocks to simulate loading state

#### Scenario: Query error state testing
- **WHEN** testing TanStack Query components
- **THEN** tests SHALL verify error state display and error handling
- **AND** tests SHALL verify retry mechanisms when implemented
- **AND** tests SHALL test user-friendly error messages

#### Scenario: Query success state testing
- **WHEN** testing TanStack Query components
- **THEN** tests SHALL verify successful data display with realistic data
- **AND** tests SHALL verify user interactions with loaded data

### Requirement: Coverage and Quality Metrics

Test coverage SHALL meet minimum thresholds while focusing on meaningful test quality over quantity.

#### Scenario: Unit test coverage requirements
- **WHEN** measuring test coverage for unit tests
- **THEN** line coverage SHALL be at least 80% for core business logic
- **AND** coverage SHALL exclude type definitions, test files, and generated code
- **AND** coverage metrics SHALL not count toward requirements for trivial getters/setters

#### Scenario: Integration test coverage focus
- **WHEN** writing integration tests
- **THEN** tests SHALL focus on critical paths rather than coverage percentage
- **AND** tests SHALL prioritize API contracts and service coordination
- **AND** all SSG provider interfaces SHALL have integration test coverage

#### Scenario: E2E test coverage requirements
- **WHEN** identifying E2E test requirements
- **THEN** 100% of critical user workflows SHALL have E2E coverage
- **AND** E2E tests SHALL NOT be written for functionality adequately covered by unit tests
- **AND** simple UI state changes (theme toggling) SHALL use unit tests instead

### Requirement: Test Tool Usage

The system SHALL use appropriate testing tools based on test type and requirements.

#### Scenario: Unit and integration test tooling
- **WHEN** writing unit or integration tests
- **THEN** Vitest SHALL be used as the test runner
- **AND** @testing-library/react SHALL be used for React component testing
- **AND** @testing-library/user-event SHALL be used for user interaction simulation

#### Scenario: E2E test tooling
- **WHEN** writing E2E tests
- **THEN** Playwright SHALL be used for cross-platform Electron testing
- **AND** tests SHALL be configured to run on Windows, macOS, and Linux when platform-specific behavior exists

#### Scenario: Mock tooling
- **WHEN** mocking is required for external dependencies
- **THEN** Vitest built-in mocking SHALL be used
- **AND** MSW (Mock Service Worker) MAY be used for HTTP API mocking when needed
- **AND** file system mocking SHALL use vi.mock('fs-extra') for unit tests only

### Requirement: Test Organization and Maintenance

Tests SHALL be organized and maintained to support long-term project health and developer productivity.

#### Scenario: Test file organization
- **WHEN** creating test files
- **THEN** unit tests SHALL be co-located with source files using .test.ts/.test.tsx extensions
- **AND** integration tests SHALL be in test/ directories within packages
- **AND** E2E tests SHALL be in a project-root e2e/ directory

#### Scenario: Test naming and structure
- **WHEN** writing test descriptions
- **THEN** test names SHALL describe the behavior being tested, not the implementation
- **AND** test structure SHALL use describe blocks to group related scenarios
- **AND** tests SHALL include arrange/act/assert phases clearly

#### Scenario: Test maintenance
- **WHEN** code behavior changes
- **THEN** tests SHALL be updated to reflect new expected behavior
- **AND** tests that become outdated SHALL be removed rather than disabled
- **AND** test fixtures SHALL be kept up-to-date with current data formats

## Implementation Notes

### Test Utilities and Helpers

Projects SHALL maintain reusable test utilities for common setup patterns:
- React Testing Library wrapper with providers (Theme, Query Client, Router)
- SSG provider mock factory
- Path testing utilities for cross-platform scenarios
- File system test helpers for temporary directory management

### Integration with Development Workflow

This testing strategy SHALL be referenced during:
- Feature development planning
- Code review processes
- CI/CD pipeline configuration
- Architecture decision making

### Enforcement Mechanisms

- Pre-commit hooks SHALL run unit tests
- CI pipelines SHALL enforce coverage thresholds
- Pull request templates SHALL prompt for appropriate test types
- Code review checklists SHALL include testing strategy compliance