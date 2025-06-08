# React Lifecycle Hooks Migration Tracking

> **Purpose:** Track the conversion of class components with deprecated lifecycle hooks to functional components with hooks.
> 
> **Instructions:** 
> - ✅ Mark components as COMPLETED when successfully converted to functional components
> - 🔄 Mark as IN_PROGRESS when migration is underway
> - ❌ Mark as BLOCKED if there are dependency issues preventing migration
> - Remove completed entries from this list or move to "Completed" section

---

## 🔴 CRITICAL PRIORITY - Complex Components (10 files)

These components have multiple lifecycle methods and complex state management. Migrate these first as they provide the most benefit.

### ❌ App.js
- **File:** `/src/App.js`
- **Component:** App (Main Application)
- **Lifecycle Methods:** `componentDidMount`, `componenWillUnmount` (typo in source)
- **Complexity:** Complex
- **Description:** Main app initialization, theme management, window events, IPC setup
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 3-4 hours
- **Dependencies:** None (root component)
- **Notes:** Core app component - test thoroughly after migration

### ❌ HoForm/Form.js
- **File:** `/src/components/HoForm/Form.js`
- **Component:** Form
- **Lifecycle Methods:** `componentDidCatch`, `componentDidMount`, `getDerivedStateFromProps`
- **Complexity:** Complex
- **Description:** Complex form state building, error boundaries, AI integration
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 4-5 hours
- **Dependencies:** Error boundaries require React 16.8+
- **Notes:** Error boundary - may need React.ErrorBoundary or custom hook

### ❌ HoForm/BaseDynamic.js
- **File:** `/src/components/HoForm/BaseDynamic.js`
- **Component:** BaseDynamic
- **Lifecycle Methods:** `shouldComponentUpdate`, `componentDidCatch`
- **Complexity:** Complex
- **Description:** Base class for dynamic components with error boundaries
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 3-4 hours
- **Dependencies:** Used by multiple dynamic components
- **Notes:** Convert to custom hook pattern, affects multiple child components

### ❌ Workspace.js
- **File:** `/src/containers/WorkspaceMounted/Workspace.js`
- **Component:** WorkSpace
- **Lifecycle Methods:** `componentDidMount`, `componentDidUpdate`
- **Complexity:** Complex
- **Description:** Workspace management, theme handling, site/workspace data loading
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 4-5 hours
- **Dependencies:** Theme context, service integration
- **Notes:** Central workspace component - test all workspace functionality

### ❌ WorkspaceSidebar.js
- **File:** `/src/containers/WorkspaceMounted/WorkspaceSidebar.js`
- **Component:** WorkspaceSidebar
- **Lifecycle Methods:** `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`
- **Complexity:** Complex
- **Description:** Sidebar state management, workspace data loading, service lifecycle
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 3-4 hours
- **Dependencies:** Workspace context
- **Notes:** Depends on Workspace.js migration

### ❌ CardItem.js
- **File:** `/src/containers/SiteLibrary/components/CardItem.js`
- **Component:** CardItem
- **Lifecycle Methods:** `componentDidMount`, `componentWillUnmount`, `componentDidUpdate`
- **Complexity:** Complex
- **Description:** Site card with screenshot/favicon loading, prop change handling
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 2-3 hours
- **Dependencies:** Image loading logic
- **Notes:** Test image loading and caching behavior

### ❌ AccordionDynamic.js
- **File:** `/src/components/SukohForm/components/AccordionDynamic.js`
- **Component:** AccordionDynamic
- **Lifecycle Methods:** `componentDidMount`
- **Complexity:** Complex
- **Description:** Dynamic accordion field processing, theme-aware styling
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 2-3 hours
- **Dependencies:** BaseDynamic.js
- **Notes:** Migrate BaseDynamic.js first

### ❌ BundleManagerDynamic.js
- **File:** `/src/components/SukohForm/components/BundleManagerDynamic.js`
- **Component:** BundleManagerDynamic
- **Lifecycle Methods:** `componentDidMount`
- **Complexity:** Complex
- **Description:** File bundle management, path validation, resource handling
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 2-3 hours
- **Dependencies:** BaseDynamic.js
- **Notes:** Migrate BaseDynamic.js first

### ❌ MarkdownDynamic.js
- **File:** `/src/components/SukohForm/components/MarkdownDynamic.js`
- **Component:** MarkdownDynamic
- **Lifecycle Methods:** `componentDidMount`
- **Complexity:** Complex
- **Description:** Markdown editor with live preview, AI integration
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 3-4 hours
- **Dependencies:** BaseDynamic.js, AI assist features
- **Notes:** Test markdown preview and AI integration

### ❌ Collection/index.js
- **File:** `/src/containers/WorkspaceMounted/Collection/index.js`
- **Component:** CollectionListItems
- **Lifecycle Methods:** Various collection management methods
- **Complexity:** Complex
- **Description:** Collection item management with dialogs and state handling
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 4-5 hours
- **Dependencies:** Dialog components, collection state
- **Notes:** Large component with multiple dialogs - consider splitting

---

## 🟡 HIGH PRIORITY - Medium Components (9 files)

These components have moderate complexity and should be migrated after critical components.

### ❌ ProgressDialog.js
- **File:** `/src/components/ProgressDialog.js`
- **Component:** ProgressDialog
- **Lifecycle Methods:** `componentDidUpdate`
- **Complexity:** Medium
- **Description:** Update dialog configuration when props change
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 1-2 hours
- **Dependencies:** Dialog state management
- **Notes:** Simple useEffect(dependencies) conversion

### ❌ SplashDialog.js
- **File:** `/src/dialogs/SplashDialog.js`
- **Component:** SplashDialog
- **Lifecycle Methods:** `componentDidMount`, `componentWillUpdate`
- **Complexity:** Medium
- **Description:** Initialize state from props, handle splash visibility
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 2 hours
- **Dependencies:** App.js state
- **Notes:** Migrate after App.js

### ❌ Console/index.js
- **File:** `/src/containers/Console/index.js`
- **Component:** ConsoleOutput
- **Lifecycle Methods:** `componentDidMount`, `componentWillUnmount`, `componentDidUpdate`
- **Complexity:** Medium
- **Description:** Service registration, auto-scroll, cleanup
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 2-3 hours
- **Dependencies:** Console service integration
- **Notes:** Test auto-scroll behavior with useEffect

### ❌ PrefsAdvanced.js
- **File:** `/src/containers/Prefs/PrefsAdvanced.js`
- **Component:** PrefsAdvanced
- **Lifecycle Methods:** `componentDidMount`
- **Complexity:** Medium
- **Description:** Load preference values and populate form fields
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 1-2 hours
- **Dependencies:** Preferences service
- **Notes:** Simple data loading conversion

### ❌ PrefsGeneral.js
- **File:** `/src/containers/Prefs/PrefsGeneral.js`
- **Component:** PrefsGeneral
- **Lifecycle Methods:** `componentDidMount`
- **Complexity:** Medium
- **Description:** Load interface preferences like theme and data folder
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 1-2 hours
- **Dependencies:** Theme management
- **Notes:** Test theme switching functionality

### ❌ PrefsVars.js
- **File:** `/src/containers/Prefs/PrefsVars.js`
- **Component:** PrefsVars
- **Lifecycle Methods:** `componentDidMount`
- **Complexity:** Medium
- **Description:** Load application variables configuration
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 1-2 hours
- **Dependencies:** Configuration service
- **Notes:** Simple data loading conversion

### ❌ SiteLibraryRouted.js
- **File:** `/src/containers/SiteLibrary/SiteLibraryRouted.js`
- **Component:** SiteLibraryRouted
- **Lifecycle Methods:** `componentDidMount`
- **Complexity:** Medium
- **Description:** Load sites, community templates, setup IPC listeners
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 2-3 hours
- **Dependencies:** IPC communication, site service
- **Notes:** Test IPC listener cleanup

### ❌ SiteLibrarySidebar.js
- **File:** `/src/containers/SiteLibrary/SiteLibrarySidebar.js`
- **Component:** SiteLibrarySidebar
- **Lifecycle Methods:** `componentDidMount`
- **Complexity:** Medium
- **Description:** Load tags and site listing preferences
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 1-2 hours
- **Dependencies:** Site library service
- **Notes:** Simple data loading conversion

### ❌ Single.js
- **File:** `/src/containers/WorkspaceMounted/Single.js`
- **Component:** Single
- **Lifecycle Methods:** `componentDidMount`, `componentWillUnmount`
- **Complexity:** Medium
- **Description:** Load single page data, register/unregister service listeners
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 2 hours
- **Dependencies:** Workspace service
- **Notes:** Test service listener cleanup

---

## 🟢 LOW PRIORITY - Simple Components (6 files)

These components have minimal lifecycle usage and can be migrated last.

### ❌ SnackbarManager.js
- **File:** `/src/components/SnackbarManager.js`
- **Component:** SnackbarManager
- **Lifecycle Methods:** `componentDidMount`, `componentWillUnmount`
- **Complexity:** Simple
- **Description:** Service registration for snackbar notifications
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 30 minutes
- **Dependencies:** Snackbar service
- **Notes:** Simple useEffect conversion

### ❌ Spinner.js
- **File:** `/src/components/Spinner.js`
- **Component:** Spinner
- **Lifecycle Methods:** `componentDidMount`, `componentWillUnmount`
- **Complexity:** Simple
- **Description:** Start animation timer, clear timeout on unmount
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 30 minutes
- **Dependencies:** Timer management
- **Notes:** Convert to useEffect with cleanup

### ❌ Chips.js
- **File:** `/src/components/Chips.js`
- **Component:** Chips
- **Lifecycle Methods:** `componentWillUnmount`
- **Complexity:** Simple
- **Description:** Clean up document mouse event listeners
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 30 minutes
- **Dependencies:** DOM event handling
- **Notes:** Convert to useEffect cleanup

### ❌ DangerButton.js
- **File:** `/src/components/DangerButton.js`
- **Component:** DangerButton
- **Lifecycle Methods:** `componentWillUnmount`
- **Complexity:** Simple
- **Description:** Clear timeout to prevent memory leaks
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 30 minutes
- **Dependencies:** Timer management
- **Notes:** Convert to useEffect cleanup

### ❌ HoForm/Updatable.js
- **File:** `/src/components/HoForm/Updatable.js`
- **Component:** Updatable
- **Lifecycle Methods:** `shouldComponentUpdate`
- **Complexity:** Simple
- **Description:** Control component re-rendering based on update prop
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 30 minutes
- **Dependencies:** Render optimization
- **Notes:** Convert to React.memo with comparison function

### ❌ SelectImagesDialog.js
- **File:** `/src/components/SelectImagesDialog.js`
- **Component:** ImageThumb (nested)
- **Lifecycle Methods:** `componentDidMount`
- **Complexity:** Simple
- **Description:** Load thumbnail images on mount
- **Migration Status:** NOT_STARTED
- **Estimated Effort:** 30 minutes
- **Dependencies:** Image loading
- **Notes:** Convert to useEffect for image loading

---

## 📊 Migration Statistics

- **Total Components:** 25
- **Not Started:** 25
- **In Progress:** 0
- **Completed:** 0
- **Blocked:** 0

### Complexity Breakdown:
- **Complex (10):** 20-25 hours estimated
- **Medium (9):** 14-20 hours estimated  
- **Simple (6):** 3 hours estimated
- **Total Estimated Effort:** 37-48 hours

### Migration Order Recommendation:
1. **Phase 1:** Simple components (3 hours) - Get team familiar with patterns
2. **Phase 2:** Medium components (14-20 hours) - Build momentum
3. **Phase 3:** Complex components (20-25 hours) - Tackle hardest parts

---

## ✅ COMPLETED MIGRATIONS

> Move completed migrations here to track progress and document any issues encountered.

*No completed migrations yet.*

---

## 🚫 BLOCKED MIGRATIONS

> List any components that cannot be migrated due to dependency issues.

*No blocked migrations yet.*

---

## 📝 Migration Notes & Patterns

### Common Conversion Patterns:

1. **componentDidMount** → `useEffect(() => {}, [])`
2. **componentWillUnmount** → `useEffect(() => () => cleanup, [])`
3. **componentDidUpdate** → `useEffect(() => {}, [dependencies])`
4. **shouldComponentUpdate** → `React.memo(Component, areEqual)`
5. **componentDidCatch** → Custom error boundary hook or keep as class

### Testing Checklist for Each Migration:
- [ ] Component renders correctly
- [ ] All functionality works as before
- [ ] No memory leaks (cleanup effects work)
- [ ] Props/state updates trigger correct re-renders
- [ ] Error boundaries still work (if applicable)
- [ ] Performance is equivalent or better

### Dependencies to Consider:
- Error boundaries may require keeping some components as classes until React 19
- Service integrations need proper cleanup
- IPC listeners need proper cleanup
- Timers and intervals need proper cleanup
- DOM event listeners need proper cleanup