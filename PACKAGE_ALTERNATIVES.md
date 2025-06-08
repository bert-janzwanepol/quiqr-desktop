# Modern Package Alternatives Guide

## Deprecated Package Replacements

### HTTP & Network Libraries
| Deprecated | Current | Modern Alternative | Reason |
|------------|---------|-------------------|---------|
| `request@2.87.0` | ❌ EOL | `axios@^1.6.0` or `node-fetch@^3.3.0` | request deprecated in 2020 |
| `node-fetch@2.6.11` | ✅ | `node-fetch@^3.3.0` | ESM support, better types |

### UI Framework
| Deprecated | Current | Modern Alternative | Breaking Changes |
|------------|---------|-------------------|------------------|
| `@material-ui/core@^4` | ❌ | `@mui/material@^5.15.0` | Package rename, theme changes, JSS→emotion |
| `@material-ui/icons@^4` | ❌ | `@mui/icons-material@^5.15.0` | Package rename only |
| `@material-ui/lab@^4` | ❌ | `@mui/lab@^5.0.0` | Package rename, some components moved |

### React Ecosystem
| Deprecated | Current | Modern Alternative | Breaking Changes |
|------------|---------|-------------------|------------------|
| `react@16.14.0` | ❌ | `react@^19.1.0` | New JSX transform, createRoot, concurrent features |
| `react-dom@16.14.0` | ❌ | `react-dom@^19.1.0` | ReactDOM.render → createRoot |
| `react-router-dom@4.3.1` | ❌ | `react-router-dom@^6.20.0` | Switch→Routes, render→element |
| `react-scripts@3.1.2` | ❌ | `react-scripts@^5.0.1` | Webpack 4→5, Node 16+ required |

### Electron Ecosystem
| Deprecated | Current | Modern Alternative | Breaking Changes |
|------------|---------|-------------------|------------------|
| `electron@9.4.4` | ❌ Critical | `electron@^28.0.0` | Remote module removed, security changes |
| `electron-builder@23.0.2` | ❌ | `electron-builder@^24.13.0` | Configuration changes |
| `electron-unhandled@1.1.0` | ❌ | `electron-unhandled@^5.0.0` | API changes |

### Development Tools
| Deprecated | Current | Modern Alternative | Notes |
|------------|---------|-------------------|-------|
| `cross-env@5.1.3` | ❌ | `cross-env@^7.0.3` | Simple upgrade |
| `copyfiles@2.1.0` | ❌ | `copyfiles@^2.4.1` | Simple upgrade |
| `fs-extra@5.0.0` | ❌ | `fs-extra@^11.2.0` | Simple upgrade, better promises |
| `glob@7.1.2` | ❌ | `glob@^10.3.0` | API changes, better performance |

### Security & Validation
| Deprecated | Current | Modern Alternative | Breaking Changes |
|------------|---------|-------------------|------------------|
| `joi@13.4.0` | ❌ | `joi@^17.11.0` | Validation API changes |
| `ajv@6.12.6` | ❌ Security | `ajv@^8.17.1` | Schema compilation changes |

### Build & Bundle Tools
| Deprecated | Current | Modern Alternative | Notes |
|------------|---------|-------------------|-------|
| `webpack@4` (via react-scripts) | ❌ | `webpack@^5` (via react-scripts 5) | Module federation, better tree shaking |
| `babel@6/7` (old) | ❌ | `@babel/core@^7.23.0` | Modern preset-env |

## Modern Development Alternatives

### Build Tools
Instead of outdated react-scripts, consider:
- **Vite** `^5.0.0` - Faster dev server, modern bundling
- **Parcel** `^2.10.0` - Zero-config bundling
- **esbuild** `^0.19.0` - Extremely fast bundling

### State Management
Instead of legacy patterns:
- **Zustand** `^4.4.0` - Lightweight, modern state
- **Jotai** `^2.6.0` - Atomic state management  
- **TanStack Query** `^5.0.0` - Server state management

### Testing
Instead of old Jest setup:
- **Vitest** `^1.0.0` - Faster, Vite-native testing
- **Playwright** `^1.40.0` - Modern E2E testing
- **Testing Library** `^14.0.0` - Modern React testing

### Styling
Instead of JSS (Material-UI v4):
- **Emotion** `^11.11.0` - CSS-in-JS (used by MUI v5)
- **Styled-components** `^6.1.0` - Popular CSS-in-JS
- **Tailwind CSS** `^3.3.0` - Utility-first CSS

### Form Handling
For the custom form system:
- **React Hook Form** `^7.48.0` - Performant forms
- **Formik** `^2.4.0` - Popular form library
- **Zod** `^3.22.0` - TypeScript-first validation

### Date Handling
| Current | Modern Alternative | Benefits |
|---------|-------------------|----------|
| `date-fns@2.30.0` | `date-fns@^3.0.0` or `dayjs@^1.11.0` | Smaller bundle, better tree shaking |

## Migration Priority

### 🔴 Critical (Security Issues)
1. `electron@9.4.4` → `electron@^28.0.0`
2. `@babel/traverse` - Critical vulnerability
3. `shell-quote` - Command injection vulnerability
4. `serialize-javascript` - XSS vulnerability

### 🟡 High Priority (Major Version Behind)
1. `react@16` → `react@19`
2. `@material-ui/*` → `@mui/*`
3. `react-router-dom@4` → `react-router-dom@6`
4. `react-scripts@3` → `react-scripts@5`

### 🟢 Medium Priority (Minor Updates)
1. `fs-extra@5` → `fs-extra@11`
2. `glob@7` → `glob@10`
3. `joi@13` → `joi@17`
4. FontAwesome packages

### 🔵 Low Priority (Working but Outdated)
1. Development tools (copyfiles, cross-env)
2. Chart.js plugins
3. Minor utility packages

## TypeScript Migration

Consider adding TypeScript for better maintainability:
```json
{
  "typescript": "^5.3.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "@types/electron": "^1.6.10",
  "@types/node": "^20.10.0"
}
```

## Bundle Analysis Tools

Add these for monitoring bundle size during migration:
```json
{
  "webpack-bundle-analyzer": "^4.10.0",
  "source-map-explorer": "^2.1.0",
  "@next/bundle-analyzer": "^14.0.0"
}
```