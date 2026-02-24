# User Feedback

**Status**: active  
**Capability**: user-feedback  
**Owner**: frontend

## Purpose

This spec defines requirements for providing user feedback when application state changes or operations complete. Users must receive clear, timely feedback for all state-changing operations to understand what happened and whether their actions succeeded.
## Requirements
### Requirement: Snackbar Messages for State Changes

All operations that change application state, workspace state, or site content MUST display a snackbar message indicating success or failure.

**Severity levels**:
- `success` - Operation completed successfully
- `error` - Operation failed due to an error
- `warning` - Operation completed but with issues
- `info` - Informational message

**Examples of state-changing operations**:
- Creating, updating, or deleting content items
- Renaming or copying files
- Converting file structures
- Saving form data
- Publishing content
- Changing settings

#### Scenario: Delete item shows success message

WHEN a user deletes a collection item and the operation succeeds  
THEN a success snackbar SHALL display "Item deleted successfully"

#### Scenario: Create item shows error on failure

WHEN a user creates a collection item and the operation fails  
THEN an error snackbar SHALL display "Failed to create item: {error reason}"

### Requirement: Error Messages Must Be Actionable

Error messages MUST include the underlying error reason when available to help users understand and resolve issues.

**Pattern**:
```typescript
onError: (error: any) => {
  addSnackMessage(`Failed to {operation}: ${error.message}`, { severity: 'error' });
}
```

#### Scenario: Error includes specific reason

WHEN a mutation fails with an error  
THEN the error snackbar SHALL include the error message text from the exception

### Requirement: Read-Only Operations Do Not Require Feedback

Operations that only read data (queries) SHALL NOT display snackbar messages. Instead, they MUST use loading indicators:
- `<LinearProgress />` for background refetching
- `<CircularProgress />` or skeleton UI for initial loading

#### Scenario: Query shows loading indicator instead of snackbar

WHEN a collection items query is fetching or refetching data  
THEN a LinearProgress indicator SHALL be displayed at the top of the collection list  
AND no snackbar messages SHALL be shown for the query

## Migration Notes

When adding snackbar messages to existing code:

1. Identify all mutation operations in the component
2. Check if they have `onSuccess` and `onError` callbacks
3. Add `addSnackMessage()` calls with appropriate messages
4. Test both success and error paths

### Requirement: Interface Style Change Feedback

The system SHALL display a snackbar message when the interface style user preference is changed.

#### Scenario: User changes interface style to dark
- **WHEN** user changes interface style from light to dark
- **AND** save operation succeeds
- **THEN** system SHALL display success snackbar "Interface style changed to quiqr10-dark"

#### Scenario: User changes interface style to light
- **WHEN** user changes interface style from dark to light
- **AND** save operation succeeds
- **THEN** system SHALL display success snackbar "Interface style changed to quiqr10-light"

#### Scenario: Interface style change fails
- **WHEN** user changes interface style
- **AND** save operation fails
- **THEN** system SHALL display error snackbar "Failed to change interface style: {error.message}"

### Requirement: Custom Open Command Feedback

The system SHALL display snackbar messages for all custom open command operations (save and execute).

#### Scenario: Custom command saved successfully
- **WHEN** user saves custom open command preference
- **AND** operation succeeds
- **THEN** system SHALL display success snackbar "Custom open command saved"

#### Scenario: Custom command save fails
- **WHEN** user saves custom open command preference
- **AND** operation fails
- **THEN** system SHALL display error snackbar "Failed to save custom open command: {error.message}"

#### Scenario: Custom command cleared successfully
- **WHEN** user clears custom open command preference
- **AND** operation succeeds
- **THEN** system SHALL display success snackbar "Custom open command cleared"

#### Scenario: Custom command executed successfully
- **WHEN** user clicks "Open In..." button to open site with custom command
- **AND** operation succeeds
- **THEN** system SHALL display success snackbar "Opened site in {command}"

#### Scenario: Custom command execution fails
- **WHEN** user clicks "Open In..." button
- **AND** operation fails
- **THEN** system SHALL display error snackbar "Failed to open site: {error.message}"

### Requirement: Git Settings Change Feedback

The system SHALL display snackbar messages when Git instance settings are changed.

#### Scenario: Git binary path updated successfully
- **WHEN** user updates Git binary path instance setting
- **AND** operation succeeds
- **THEN** system SHALL display success snackbar "Git binary path updated"

#### Scenario: Git binary path update fails
- **WHEN** user updates Git binary path instance setting
- **AND** operation fails
- **THEN** system SHALL display error snackbar "Failed to update Git binary path: {error.message}"

### Requirement: Logging Settings Change Feedback

The system SHALL display snackbar messages when logging instance settings are changed.

#### Scenario: Log retention updated successfully
- **WHEN** user updates log retention instance setting
- **AND** operation succeeds
- **THEN** system SHALL display success snackbar "Log retention updated to {value} days"

#### Scenario: Log retention update fails
- **WHEN** user updates log retention instance setting
- **AND** operation fails
- **THEN** system SHALL display error snackbar "Failed to update log retention: {error.message}"

## Related Specs

- **Frontend State Management**: Defines mutation patterns using TanStack Query
- **Frontend Components**: Snackbar context implementation
- **Collection Management**: Examples of applying user feedback to collection operations
