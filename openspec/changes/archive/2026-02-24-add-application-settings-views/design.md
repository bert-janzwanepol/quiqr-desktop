## Context

The Preferences view (`packages/frontend/src/containers/Prefs/`) currently has two sidebar sections: "General" and "Advanced". These are site-agnostic but mixed with various preference types.

We need to add a dedicated "Application Settings" section with a "Storage" page that allows users to view and modify the storage path (`dataFolder` in `AppConfig.prefs`). The existing `AppConfig` class already persists this setting in `quiqr-app-config.json`, and there's a `config-handlers.ts` with basic preference access.

This change is related to the ongoing unified configuration architecture work (2026-02-12-unify-configuration-architecture) but is designed to work with the current system while being compatible with future improvements.

**Architectural Context - Application Settings vs User Preferences:**

This change establishes a critical semantic separation:
- **Application Settings** (new): System-wide configuration affecting the entire Quiqr application (e.g., storage path, logging, system preferences). Only modifiable in Electron edition (single-user). In standalone edition (multi-user), these should eventually be admin-only or hidden for regular users.
- **User Preferences** (existing General/Advanced): Per-user settings that can be modified by any user in both Electron and standalone editions (e.g., UI theme, editor preferences).

This distinction is important for the future multi-user standalone architecture, but implementing access control or hiding is explicitly a non-goal for this change. This change only establishes the UI structure to support future enforcement.

## Goals / Non-Goals

**Goals:**
- Add a new "Application Settings" section to the Preferences sidebar with a dedicated Storage page
- Allow users to view and modify the storage path (`AppConfig.prefs.dataFolder`)
- Follow existing patterns in the Prefs container (sidebar menu structure, routing)
- Use existing `AppConfig` persistence without requiring schema changes
- Support both Electron and standalone runtime modes

**Non-Goals:**
- Migrating other settings to Application Settings (can be added incrementally)
- Path validation, migration, or recommendations
- Breaking changes to existing General/Advanced preferences
- Changing the underlying config persistence mechanism
- Implementing access control or hiding Application Settings in standalone edition (future work)
- User role/permission system for admin-only settings

## Decisions

### 1. Sidebar Structure: New Menu Group vs. Adding to Existing Menu

**Decision:** Create a new menu group "Application Settings" separate from the existing "Preferences" menu.

**Rationale:**
- Provides clear separation between general preferences and application-level settings
- Makes future additions of other application settings (like theme, logs, etc.) natural
- The `Sidebar` component already supports multiple menu groups (see `SiteConfSidebar` which has multiple sections)
- Aligns with the semantic distinction in the proposal

**Alternatives Considered:**
- Adding as items to existing Preferences menu → Would mix concerns and make it harder to grow
- Replacing the Preferences sidebar entirely → Too invasive and breaks existing patterns

**Implementation:**
- Modify `PrefsSidebar.tsx` to return two menu objects in the `menus` array
- First menu: existing "Preferences" with General/Advanced
- Second menu: new "Application Settings" with Storage

### 2. Storage Path API: New Endpoints vs. Extending Existing

**Decision:** Extend existing `config-handlers.ts` with storage-specific endpoints.

**Rationale:**
- `config-handlers.ts` already handles preference access (`GET /api/conf`, `GET /api/conf/one/:confkey`)
- Natural fit for storage path operations
- Avoids creating a new handler file for a single feature
- Can use the existing DI container pattern (`container.config.prefs`)

**Alternatives Considered:**
- Create new `settings-handlers.ts` → Premature since we only have one setting
- Use generic `/api/conf/one/dataFolder` → Too generic, doesn't validate storage-specific concerns

**Implementation:**
- Add `POST /api/storage-path` handler in `config-handlers.ts`
- Add `GET /api/storage-path` handler (or use existing `/api/conf/one/dataFolder`)
- Add Zod schema in `packages/types/src/schemas/api.ts` for request/response
- Add `getStoragePath()` and `setStoragePath(path: string)` methods in `packages/frontend/src/api.ts`

### 3. Storage View Component: Form vs. Read/Edit Mode

**Decision:** Simple form with a text input and "Change Path" button that shows a directory picker.

**Rationale:**
- Matches user expectation for path configuration
- Can leverage existing file picker APIs (backend should have these for site imports)
- Simple, direct interaction pattern
- No complex validation needed (assumes user knows what they're doing)

**Alternatives Considered:**
- Inline editable text field → Less discoverable, no native picker
- Display-only with separate dialog → Extra clicks, more complex

**Implementation:**
- Create `packages/frontend/src/containers/Prefs/PrefsApplicationStorage.tsx`
- Use MUI `TextField` (read-only) + `Button` to trigger directory picker
- Follow pattern from `PrefsGeneral.tsx` for styling and layout
- Add error handling for write failures

### 4. Routing: Nested Routes vs. Flat

**Decision:** Keep flat routing structure (`/prefs/storage`) within existing Prefs router.

**Rationale:**
- Existing structure uses flat routes (`/prefs/general`, `/prefs/advanced`)
- No need for nesting since we're not creating a separate "Application Settings" router context
- Simpler to implement and maintains consistency

**Implementation:**
- Add route in `PrefsRouted.tsx`: `<Route path="storage" element={<PrefsApplicationStorage />} />`
- Update sidebar link to `/prefs/storage`

## Risks / Trade-offs

### [Risk] Storage path change doesn't take effect until restart
**Mitigation:** Display a notice/toast message after save indicating that changes may require restart. Document this behavior.

### [Risk] Invalid path causes application data loss or errors
**Mitigation:**
- Don't implement path validation in this change (as per non-goals)
- Trust user input for now
- Future work can add validation if needed

### [Risk] Path picker API might not exist in standalone mode
**Mitigation:**
- Check existing dialog handlers for directory picker support
- If missing, show text input only with manual path entry in standalone mode
- Electron can use native dialog

### [Trade-off] Extending config-handlers.ts vs. new handler file
**Trade-off:** Config-handlers may become cluttered if many settings are added.
**Mitigation:** Easy to refactor into dedicated settings handlers later if needed (first change is hardest).

## Migration Plan

N/A - This is purely additive. No data migration needed. Existing `dataFolder` setting in `AppConfig.prefs` is already persisted and will continue to work.

## Open Questions

1. **Does a directory picker API exist in the backend?**
   - Need to check `dialog-handlers.ts` for existing directory selection
   - If not, should we add it in this change or defer to manual input?
   - RESOLVED: Yes, `showOpenFolderDialog` exists in dialog-handlers.ts

2. **Should we add a "Reset to Default" button?**
   - Low priority, can be added later
   - Default is `~/Quiqr` from `AppConfig`

## Future Considerations

**Access Control for Standalone Edition:**

When implementing multi-user support in standalone edition, Application Settings will need:
- User role/permission system (admin vs regular user)
- Conditional rendering or route guards to hide/restrict Application Settings for non-admin users
- Backend enforcement to prevent non-admin API access to system-wide settings
- Migration of appropriate settings from "Preferences" to "User Preferences" if needed

This UI separation (Application Settings vs Preferences) is designed to make that future work straightforward without requiring major restructuring.
