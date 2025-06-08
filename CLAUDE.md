# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Development Commands
- `npm install` - Install dependencies 
- `npm run start` - Start development mode (runs both React frontend and Electron backend concurrently)
- `npm run _react-dev` - Start React frontend only (runs on port 4001)
- `npm run _electron-dev` - Start Electron backend only
- `npm run _pack_embgit` - Download/update embgit binary (required before first run)
- `npm run build` - Build production version
- `npm run dist` - Create distributable packages
- `npm test` - Run tests

### Development with DevTools
- `DEVTOOLS=1 npm run _electron-dev` - Start Electron with DevTools window

### Build Related
- `npm run _build_info` - Generate build information
- `npm run _hugo_versions` - Update Hugo version list
- `npm run clean` - Clean build directories

### Release
- `npm run release` - Create new release (updates changelog, version, creates git tag)

## Architecture Overview

Quiqr Desktop is an Electron-based CMS for Hugo static sites with the following key architectural components:

### Frontend (React)
- **Location**: `src/` directory
- **Framework**: React 16 with Material-UI v4 components
- **Routing**: React Router for client-side navigation
- **Main App**: `src/App.js` handles routing, theming, and window management
- **Key Containers**: 
  - `WorkspaceMounted/` - Main content editing interface
  - `SiteLibrary/` - Site management and creation
  - `Prefs/` - Application preferences
  - `Console/` - Debug console interface

### Backend (Electron Main Process)
- **Location**: `src-main/` directory
- **Entry Point**: `src-main/electron.js`
- **Bridge**: `src-main/bridge/` contains IPC communication between frontend and backend
- **Services**: Core business logic in `src-main/services/`
  - Site management, workspace handling, library operations
- **Hugo Integration**: `src-main/hugo/` handles Hugo static site generation
- **Sync**: `src-main/sync/` manages Git synchronization (GitHub, folder, sysgit)

### Key Services Architecture
- **API Bridge**: `src-main/bridge/api-main.js` exposes backend functions to frontend via IPC
- **Site Service**: Manages Hugo sites and their configurations
- **Workspace Service**: Handles content workspaces within sites
- **Library Service**: Manages site library and templates
- **Sync Services**: Handle various sync backends (GitHub, local Git, folder sync)

### Form System
- **HoForm**: Legacy form system in `src/components/HoForm/`
- **SukohForm**: Modern dynamic form system in `src/components/SukohForm/`
  - Handles dynamic component rendering based on configuration
  - Supports various field types (markdown, select, date, etc.)

### External Dependencies
- **embgit**: Go binary for Git operations, downloaded via `scripts/embgit.sh`
- **Hugo**: Static site generator, versions managed in `resources/all/`

### File Structure Conventions
- `src-main/` - Electron main process code (Node.js)
- `src/` - React frontend code
- `resources/` - Platform-specific binaries and configuration
- `public/` - Electron public assets and main entry point
- `scripts/` - Build and utility scripts

### Development Notes
- The app uses a bridge pattern for frontend-backend communication via Electron IPC
- Hugo sites are managed through workspace configurations
- The application supports multiple sync backends for content deployment
- UI theming supports both light and dark modes via Material-UI themes