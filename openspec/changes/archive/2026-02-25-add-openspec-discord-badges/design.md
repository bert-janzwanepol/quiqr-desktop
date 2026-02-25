## Context

The Quiqr Desktop README currently lacks visual indicators of project health and community engagement. The project uses GitHub Actions for CI/CD with an existing deploy workflow that generates coverage badges and deploys to GitHub Pages. The badge system is already established with badges for deploy status, coverage, version, and license.

Current state:
- `.github/workflows/deploy.yml` generates coverage badge using `we-cli/coverage-badge-action@main`
- Badges are hosted on GitHub Pages at `https://quiqr.github.io/quiqr-desktop/badges/`
- README has a navigation paragraph with textual links that duplicate badge functionality
- Discord server exists with invite code `nJ2JH7jvmV`

## Goals / Non-Goals

**Goals:**
- Add automated OpenSpec badge generation to CI workflow
- Display OpenSpec metrics (specs count, tasks status) as badges in README
- Display Discord community activity (online users) as badge in README
- Maintain consistent visual style (classic/gradient) across all badges
- Remove redundant textual navigation links

**Non-Goals:**
- Not changing badge implementation in documentation files beyond README
- Not modifying existing coverage badge workflow
- Not creating custom badge rendering service (use existing actions/shields.io)
- Not adding badges to GitHub PR templates or issue templates

## Decisions

### Decision 1: Use wearetechnative/openspec-badge-action
**Choice:** Integrate `wearetechnative/openspec-badge-action@main` into existing deploy workflow

**Rationale:**
- Official OpenSpec badge action from TechNative (OpenSpec maintainers)
- Consistent with existing badge generation pattern (coverage badge action)
- Supports multiple metrics via `metric_types` parameter
- Outputs to gh-pages branch automatically, matching current infrastructure

**Alternatives considered:**
- Custom badge generation script: Rejected due to maintenance overhead
- shields.io dynamic badges: Rejected as OpenSpec metrics not available via shields.io API

### Decision 2: Generate badges in coverage job before Pages deployment
**Choice:** Add badge generation step in existing `coverage` job after coverage badge, before `publish-openspec` job runs

**Rationale:**
- Badges need to be committed to gh-pages before Pages deployment
- coverage job already has write permissions for badge generation
- Keeps all badge generation in one job for consistency
- publish-openspec job preserves existing badges during deployment

**Alternatives considered:**
- Separate badge generation job: Rejected to avoid permission complexity
- Generate in publish-openspec job: Rejected as it lacks write permissions

### Decision 3: Use shields.io for Discord badge
**Choice:** Use shields.io Discord endpoint with invite code instead of server ID lookup

**Rationale:**
- shields.io Discord endpoint is well-established and reliable
- Requires only the invite code (already public in README)
- No additional API keys or configuration needed
- Classic style support matches other badges

**Alternatives considered:**
- Custom Discord badge service: Rejected due to unnecessary complexity
- Discord widget embed: Rejected as it's not a badge format

### Decision 4: Badge placement order and link targets
**Choice:**
- Order: Deploy, Coverage, Version, License, OpenSpec Specs, OpenSpec Tasks, Discord
- OpenSpec badges link to `https://quiqr.github.io/quiqr-desktop/specs`
- Discord badge links to `https://discord.gg/nJ2JH7jvmV`

**Rationale:**
- Grouped by category: CI/release metrics, project metrics, community
- OpenSpec badges together for visual grouping
- Links point to natural destinations (OpenSpec UI for specs, Discord invite for community)

**Alternatives considered:**
- All OpenSpec badges link to individual badge images: Rejected as less useful to users
- Discord badge links to shields.io docs: Rejected as invite is more actionable

### Decision 5: Remove duplicate navigation links
**Choice:** Remove "Discord" and "OpenSpec UI" textual links from header navigation paragraph (lines 10-11), keeping only Website and Documentation

**Rationale:**
- Badges provide same functionality with visual status indicators
- Reduces header clutter
- Discord link preserved in "Support and Questions" section (line 69)
- Documentation link more relevant than OpenSpec UI for general users

**Alternatives considered:**
- Keep all links: Rejected due to redundancy
- Remove all navigation: Rejected as Website/Docs links remain useful

## Risks / Trade-offs

### Risk: Discord badge requires server widget enabled
**Mitigation:** Verify Discord server widget is enabled before deployment. If not, coordinate with server admin (@mipmip or @bert-janzwanepol) to enable in server settings > Engagement > Enable Server Widget.

### Risk: OpenSpec badge action updates may break workflow
**Mitigation:** Pin to `@main` branch as recommended by TechNative. Monitor action repository for breaking changes. Workflow is non-blocking (failure won't stop deployment).

### Risk: Badge count discrepancy during development
**Mitigation:** Acceptable trade-off - badges update only on main branch push, may briefly show stale counts during active development. This is standard for GitHub Actions badges.

### Trade-off: Using invite code vs server ID for Discord
**Choice:** Use invite code (simpler, already public)
**Trade-off:** Invite code may change if regenerated, requiring README update. Server ID is permanent but requires lookup.
**Rationale:** Invite code is already in README in multiple places, low change risk.

## Migration Plan

### Deployment Steps
1. Verify Discord server widget is enabled
2. Merge PR to main branch
3. GitHub Actions will automatically:
   - Generate OpenSpec badges
   - Deploy updated README and badges to GitHub Pages
4. Verify badges appear correctly in README on GitHub

### Rollback Strategy
If badges don't display correctly:
1. Revert the README changes via Git
2. Previous coverage badge remains functional (unchanged)
3. OpenSpec badge generation step can be removed from workflow without affecting deployment

### Validation
- README displays all 7 badges in correct order
- OpenSpec badges link to specs UI
- Discord badge shows online count
- Discord badge links to invite
- Navigation paragraph shows only Website and Documentation links

## Open Questions

None - implementation is straightforward given existing badge infrastructure.
