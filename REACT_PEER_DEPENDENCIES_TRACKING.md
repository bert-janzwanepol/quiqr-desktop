# React Peer Dependencies Compatibility Tracking

> **Purpose:** Track packages that need updates or replacements to support React 17/18/19.
> 
> **Instructions:**
> - ✅ Mark as COMPATIBLE when package supports React 17/18/19
> - 🔄 Mark as NEEDS_UPDATE when newer version supports React 17/18/19
> - ❌ Mark as REPLACE when no React 17/18/19 support available (find alternative)
> - 🆕 Mark as NEW when adding new package for replacement

---

## 🔴 CRITICAL - Must Fix Before React 17+ Migration

### ❌ REPLACE - No React 17+ Support

#### @material-ui/* packages (Must Replace)
- **Package:** `@material-ui/core@4.12.4`
- **Current Peer Deps:** `react: ^16.8.0 || ^17.0.0` (stops at React 17)
- **Status:** REPLACE 
- **Replacement:** `@mui/material@^5.15.0`
- **New Peer Deps:** `react: ^17.0.0 || ^18.0.0`
- **Migration Impact:** High - Complete package rename and API changes
- **Action Required:** Phase 4 of upgrade plan
- **Notes:** Material-UI v4 is EOL, must migrate to MUI v5/v6

#### @material-ui/icons (Must Replace)
- **Package:** `@material-ui/icons@4.11.3`
- **Current Peer Deps:** `react: ^16.8.0 || ^17.0.0` (stops at React 17)
- **Status:** REPLACE
- **Replacement:** `@mui/icons-material@^5.15.0`
- **New Peer Deps:** `react: ^17.0.0 || ^18.0.0`
- **Migration Impact:** Medium - Package rename only, minimal API changes
- **Action Required:** Update imports after MUI migration
- **Notes:** Direct replacement, icon names remain the same

#### @material-ui/lab (Must Replace)
- **Package:** `@material-ui/lab@4.0.0-alpha.61`
- **Current Peer Deps:** `react: ^16.8.0 || ^17.0.0` (stops at React 17)
- **Status:** REPLACE
- **Replacement:** `@mui/lab@^5.0.0`
- **New Peer Deps:** `react: ^17.0.0 || ^18.0.0`
- **Migration Impact:** Medium - Some components moved to core
- **Action Required:** Check which lab components are used
- **Notes:** Some components graduated to @mui/material

#### react-fa-icon-picker (Must Replace)
- **Package:** `react-fa-icon-picker@1.0.3`
- **Current Peer Deps:** `react: ^16.8.0` (React 16 only)
- **Status:** REPLACE
- **Replacement:** Consider building custom or find alternative
- **Alternative 1:** `@fortawesome/react-fontawesome` with custom picker
- **Alternative 2:** `react-icons` with custom picker component
- **Migration Impact:** High - Need to rebuild icon picker functionality
- **Action Required:** Evaluate if still needed, build custom component
- **Notes:** Appears to be abandoned package, last update 2+ years ago

---

## 🟡 NEEDS UPDATE - Available Updates Support React 17/18/19

#### 🔄 NEEDS_UPDATE - Can Be Updated

#### react-simplemde-editor (Needs Update)
- **Package:** `react-simplemde-editor@5.0.2`
- **Current Peer Deps:** `react: >=16.8.2` (open-ended, but version is old)
- **Current Status:** NEEDS_UPDATE
- **Latest Version:** `5.2.0`
- **Latest Peer Deps:** `react: >=16.8.2` (should work with React 17/18/19)
- **Migration Impact:** Low - Minor version update
- **Action Required:** Test with React 17/18/19
- **Notes:** Update to latest version and verify compatibility

#### chart.js ecosystem (Dependencies)
- **Package:** `react-chartjs-2@4.3.1`
- **Current Peer Deps:** `react: ^16.8.0 || ^17.0.0 || ^18.0.0` (missing React 19)
- **Current Status:** NEEDS_UPDATE for React 19
- **Latest Version:** `5.2.0`
- **Latest Peer Deps:** Likely includes React 19 support
- **Migration Impact:** Medium - Chart.js 3→4 breaking changes possible
- **Action Required:** Update both chart.js and react-chartjs-2
- **Notes:** Update chart.js@^4.4.0 and react-chartjs-2@^5.2.0

---

## ✅ COMPATIBLE - Already Support React 17/18/19

#### FontAwesome Packages (Compatible)
- **Package:** `@fortawesome/react-fontawesome@0.2.0`
- **Current Peer Deps:** `react: >=16.3` (open-ended)
- **Status:** COMPATIBLE
- **Action Required:** None for React compatibility
- **Notes:** Update to `@0.2.2` for latest features

#### React Datepicker (Compatible)
- **Package:** `react-datepicker@4.11.0`
- **Current Peer Deps:** `react: ^16.9.0 || ^17 || ^18` (missing React 19)
- **Latest Version:** `^4.25.0` or newer may include React 19
- **Status:** COMPATIBLE (needs version check for React 19)
- **Action Required:** Update to latest version for React 19 support
- **Notes:** Well-maintained package with good React support

#### React Router DOM (Compatible)
- **Package:** `react-router-dom@4.3.1`
- **Current Peer Deps:** `react: >=15` (very open-ended)
- **Status:** COMPATIBLE (but major version behind)
- **Latest Version:** `6.20.0`
- **Action Required:** Major version upgrade (v4→v6) per upgrade plan
- **Notes:** React compatibility not the issue - API changes are

#### React Transition Group (Compatible)
- **Package:** `react-transition-group@4.4.5`
- **Current Peer Deps:** `react: >=16.6.0` (open-ended)
- **Status:** COMPATIBLE
- **Action Required:** None for React compatibility
- **Notes:** Stable package with good React version support

---

## 🔍 REQUIRES INVESTIGATION

#### react-scripts (Special Case)
- **Package:** `react-scripts@3.1.2`
- **Current Peer Deps:** No explicit React peer deps (bundles React)
- **Status:** REQUIRES_INVESTIGATION
- **Latest Version:** `5.0.1`
- **Issue:** Controls React version and webpack configuration
- **Action Required:** Upgrade to react-scripts@5 (webpack 4→5)
- **Notes:** This upgrade enables React 17/18/19 - critical dependency

#### Dev Dependencies (Framework Support)
- **Package:** Various `@testing-library/*` packages
- **Status:** REQUIRES_INVESTIGATION  
- **Action Required:** Verify testing library versions support React 17/18/19
- **Notes:** May need updates for React 19 testing

---

## 📋 MIGRATION CHECKLIST BY REACT VERSION

### React 16 → React 17 Requirements:
- ✅ `@fortawesome/react-fontawesome` - Compatible
- ✅ `react-chartjs-2` - Compatible  
- ✅ `react-datepicker` - Compatible
- ✅ `react-router-dom` - Compatible (old version)
- ✅ `react-transition-group` - Compatible
- ✅ `react-simplemde-editor` - Compatible
- ❌ `@material-ui/*` - Max React 17 (EOL)
- ❌ `react-fa-icon-picker` - React 16 only

### React 17 → React 18 Requirements:
- ✅ Most packages compatible
- 🔄 `react-chartjs-2` - Check latest version
- 🔄 `react-datepicker` - Check latest version
- ❌ `@material-ui/*` - Still blocked
- ❌ `react-fa-icon-picker` - Still blocked

### React 18 → React 19 Requirements:
- 🔄 `react-chartjs-2` - Need latest version
- 🔄 `react-datepicker` - Need latest version  
- 🔍 All packages - Verify React 19 peer dep support
- ❌ `@material-ui/*` - Must replace with MUI
- ❌ `react-fa-icon-picker` - Must replace

---

## 🎯 ACTION PLAN PRIORITIES

### Phase 1: Before React 17 Migration
1. **Replace `@material-ui/*`** → **`@mui/*`** (Critical blocker)
2. **Replace `react-fa-icon-picker`** → Custom component or alternative
3. **Update `react-scripts`** 3→5 (Enables React 17/18/19)

### Phase 2: Before React 18 Migration  
1. **Update `react-chartjs-2`** to latest
2. **Update `react-datepicker`** to latest
3. **Update `react-simplemde-editor`** to latest
4. **Verify all peer dependencies** support React 18

### Phase 3: Before React 19 Migration
1. **Verify React 19 peer dependency support** for all packages
2. **Update to latest versions** that explicitly support React 19
3. **Test all components** with React 19

---

## 📦 REPLACEMENT PACKAGES FOR BLOCKERS

### Material-UI Replacement Strategy:
```json
{
  "@material-ui/core": "REMOVE",
  "@material-ui/icons": "REMOVE", 
  "@material-ui/lab": "REMOVE",
  "@mui/material": "ADD ^5.15.0",
  "@mui/icons-material": "ADD ^5.15.0",
  "@mui/lab": "ADD ^5.0.0",
  "@emotion/react": "ADD ^11.11.0",
  "@emotion/styled": "ADD ^11.11.0"
}
```

### Icon Picker Replacement Options:
```json
{
  "react-fa-icon-picker": "REMOVE",
  "Option 1": "@fortawesome/react-fontawesome + custom picker",
  "Option 2": "react-icons + custom picker", 
  "Option 3": "Custom FontAwesome integration"
}
```

---

## 🔄 UPDATE COMMANDS

### Safe Updates (Non-breaking):
```bash
npm update @fortawesome/react-fontawesome
npm update react-simplemde-editor
npm update react-transition-group
```

### Major Updates (Breaking changes):
```bash
# React Router (v4 → v6)
npm install react-router-dom@^6.20.0

# Chart.js ecosystem  
npm install chart.js@^4.4.0 react-chartjs-2@^5.2.0

# React Datepicker
npm install react-datepicker@^4.25.0
```

### Replacements (Remove + Add):
```bash
# Material-UI → MUI
npm uninstall @material-ui/core @material-ui/icons @material-ui/lab
npm install @mui/material @mui/icons-material @mui/lab @emotion/react @emotion/styled

# Icon Picker (after building replacement)
npm uninstall react-fa-icon-picker
```

---

## 📊 TRACKING STATISTICS

- **Total React Dependencies:** 10
- **Compatible:** 4 (40%)
- **Needs Update:** 2 (20%)
- **Must Replace:** 4 (40%)
- **Critical Blockers:** 4 (@material-ui/*, react-fa-icon-picker)

### Risk Assessment:
- **High Risk:** Material-UI migration (affects entire UI)
- **Medium Risk:** Chart.js ecosystem update
- **Low Risk:** FontAwesome and utility package updates