## Why

The README currently lacks visual badges showing OpenSpec metrics (number of specs, open todos) and Discord community activity. Adding these badges provides immediate visibility into project health and community engagement for potential contributors and users.

## What Changes

- Add OpenSpec badge generation step to `.github/workflows/deploy.yml` using `wearetechnative/openspec-badge-action`
- Add two OpenSpec badges to README after License badge: specs count and open todos
- Add Discord online users badge to README after OpenSpec badges
- Remove redundant textual links to Discord and OpenSpec UI from the navigation section (lines 10-11)
- All badges will use classic style with labels enabled

## Capabilities

### New Capabilities
- `readme-badge-layout`: Badge layout and organization in README

### Modified Capabilities
- `ci-automation`: Add OpenSpec badge generation to existing deploy workflow without breaking coverage badge, OpenSpec UI, or documentation deployment

## Impact

### Affected Files
- `.github/workflows/deploy.yml` - Add badge generation step after coverage badge
- `README.md` - Add badges to header section, remove duplicate navigation links

### Infrastructure
- Requires GitHub Actions permissions already in place for gh-pages deployment
- Badges will be hosted at `https://quiqr.github.io/quiqr-desktop/badges/`
- Discord badge requires server widget to be enabled (verify with server admin)

### Dependencies
- Uses existing `wearetechnative/openspec-badge-action@main`
- Discord badge uses shields.io API with server invite code `nJ2JH7jvmV`

## Non-goals

- Not modifying badge styles in other documentation files
- Not adding badges to other markdown files beyond README
- Not changing existing coverage badge implementation
