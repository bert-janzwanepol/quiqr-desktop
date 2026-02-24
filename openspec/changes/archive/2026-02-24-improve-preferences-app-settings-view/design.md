## Context

The unify-configuration-architecture change implemented a 2-layer config system (App Defaults → User Preferences) with instance settings stored separately. The Preferences UI predates this change and still references obsolete settings, lacks proper user feedback, and misplaces instance-level settings in user preference sections.

**Current state:**
- PrefsGeneral shows "Quiqr Data Folder" (now obsolete - storage path is in instance settings)
- Interface Style changes don't show snackbar feedback (violates user-feedback spec)
- Custom Open-In Command exists but unclear where it's stored
- Git binary path and Log Retention are in wrong settings category

**Existing patterns:**
- PrefsGeneral.tsx, PrefsAdvanced.tsx - user preference pages using TanStack Query
- PrefsApplicationStorage.tsx - instance settings page (pattern to follow)
- PrefsSidebar.tsx - menu structure with Preferences and Application Settings groups
- api.ts - `setUserPreference()`, `setInstanceSetting()`, `getEffectivePreference()`
- queries/options.ts - TanStack Query options for prefs
- User feedback via `useSnackMessage()` hook

## Goals / Non-Goals

**Goals:**
- Clean up obsolete "Quiqr Data Folder" from PrefsGeneral
- Add snackbar feedback for Interface Style changes
- Ensure Custom Open-In Command persists to user preferences with feedback
- Create PrefsGit page (Application Settings) for Git binary path (instance setting)
- Create PrefsLogging page (Application Settings) for Log Retention (instance setting)
- Add Site Tools button for Custom Open-In Command
- Comprehensive test coverage for settings views

**Non-Goals:**
- Implementing access control for Application Settings (deferred)
- Changing underlying config storage structure (already done)
- Adding new settings beyond reorganizing existing ones

## Decisions

### Decision 1: Remove Quiqr Data Folder from PrefsGeneral

**Rationale:** This setting was replaced by unified-config's storage.dataFolder instance setting. The PrefsApplicationStorage page already handles storage configuration.

**Implementation:**
- Remove FolderPicker component and related query/mutation logic from PrefsGeneral.tsx
- Verify no other components depend on dataFolder user preference

**Alternatives considered:**
- Keep as read-only display: Rejected - confusing to show in two places
- Migrate to instance settings: Already done by unified-config change

### Decision 2: Add Snackbar Feedback to Interface Style

**Rationale:** User-feedback spec requires snackbar messages for all state-changing operations. Interface Style is a user preference that persists to storage.

**Implementation:**
- Import `useSnackMessage` hook in PrefsGeneral
- Add `onSuccess` callback to `savePrefMutation` for interfaceStyle
- Message: "Interface style changed to {Light|Dark}"

**Pattern:**
```typescript
const { addSnackMessage } = useSnackMessage();
savePrefMutation.mutate(
  { prefKey: 'interfaceStyle', prefValue: value },
  {
    onSuccess: () => {
      addSnackMessage(`Interface style changed to ${value}`, { severity: 'success' });
    },
    onError: (error) => {
      addSnackMessage(`Failed to change interface style: ${error.message}`, { severity: 'error' });
    }
  }
);
```

### Decision 3: Custom Open-In Command Storage and Integration

**Rationale:** This is a user-specific preference (different users may want different editors), so it belongs in user preferences, not instance settings.

**Implementation:**
- Store in user preferences as `customOpenCommand: string | undefined`
- Add field to PrefsGeneral or PrefsAdvanced (TBD in specs)
- Add snackbar feedback on save per user-feedback spec
- Create button in Site Tools section that:
  - Shows only when customOpenCommand is set
  - Calls backend API to execute command with site path
  - Shows snackbar feedback on success/error

**Alternatives considered:**
- Instance setting: Rejected - this is user-specific, not system-wide
- Always visible button: Rejected - confusing when command not configured

### Decision 4: Move Git Binary Path to Application Settings → Git

**Rationale:** Git binary path affects how the entire Quiqr instance operates (all sites, all workspaces), not just one user's preference. This is an instance-level setting.

**Implementation:**
- Create `PrefsGit.tsx` in same pattern as PrefsApplicationStorage
- Use instance settings API: `getInstanceSetting('git.binaryPath')`, `setInstanceSetting('git.binaryPath', value)`
- Add to Application Settings menu in PrefsSidebar
- Add snackbar feedback per user-feedback spec
- Route: `/prefs/git`

**Schema requirement:**
- Verify `packages/types/src/schemas/config.ts` has `git.binaryPath` in instance settings schema
- Add if missing

### Decision 5: Move Log Retention to Application Settings → Logging

**Rationale:** Log retention affects system-wide logging behavior, not per-user preferences. This is an instance-level setting.

**Implementation:**
- Create `PrefsLogging.tsx` following PrefsApplicationStorage pattern
- Use instance settings API: `getInstanceSetting('logging.retention')`, `setInstanceSetting('logging.retention', value)`
- Add to Application Settings menu in PrefsSidebar
- Add snackbar feedback per user-feedback spec
- Route: `/prefs/logging`

**Schema requirement:**
- Verify `packages/types/src/schemas/config.ts` has `logging.retention` in instance settings schema
- Add if missing

### Decision 6: Testing Strategy

**Test types:**
- Component tests for each Prefs view (PrefsGeneral, PrefsGit, PrefsLogging)
- Integration tests for mutation callbacks and user feedback
- Tests for Custom Open-In Command button visibility and execution

**Reference:** Existing tests in `packages/backend/src/config/__tests__/` for config layer patterns

## Risks / Trade-offs

**Risk:** Breaking existing user preferences during settings reorganization
→ **Mitigation:** Read-only removal (dataFolder), new settings won't conflict with existing

**Risk:** Users confused by missing "Quiqr Data Folder" setting
→ **Mitigation:** Already moved to Application Settings → Storage by previous change

**Risk:** Custom Open-In Command not working if binary path invalid
→ **Mitigation:** Show clear error message in snackbar, validate path before execution

**Risk:** Git/Logging instance settings changes affect running operations
→ **Mitigation:** Document that changes take effect on next operation (no hot reload)

## Migration Plan

**Deployment:**
1. Add types schema updates (git.binaryPath, logging.retention if needed)
2. Build types package: `npm run build -w @quiqr/types`
3. Add backend handler support for new instance settings
4. Create new preference views (PrefsGit, PrefsLogging)
5. Update PrefsSidebar to add new menu items
6. Update PrefsGeneral to remove dataFolder, add snackbar to interfaceStyle
7. Add Custom Open-In Command integration
8. Add tests
9. Build and test in development: `npm run dev`
10. Run full test suite: `npm run test`

**Rollback:**
- If issues arise, previous unified-config change allows reverting UI changes without affecting backend
- Settings stored in separate config files can be manually edited if needed

**No data migration required** - existing user preferences and instance settings remain intact

## Open Questions

None - all decisions finalized based on unified-config spec and user-feedback spec requirements.
