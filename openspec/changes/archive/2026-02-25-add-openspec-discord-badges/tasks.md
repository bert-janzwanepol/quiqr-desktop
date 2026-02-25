## 1. CI Workflow Changes

- [x] 1.1 Add OpenSpec badge generation step to .github/workflows/deploy.yml after coverage badge step
- [x] 1.2 Configure openspec-badge-action with metric_types="number_of_specs,tasks_status"
- [x] 1.3 Set badge_style="classic" and show_label=true in action configuration
- [x] 1.4 Verify step runs only on main branch (if: github.ref == 'refs/heads/main')

## 2. README Badge Updates

- [x] 2.1 Add OpenSpec Specs badge after License badge with link to https://quiqr.github.io/quiqr-desktop/specs
- [x] 2.2 Add OpenSpec Tasks badge after OpenSpec Specs badge with link to https://quiqr.github.io/quiqr-desktop/specs
- [x] 2.3 Add Discord badge after OpenSpec badges with link to https://discord.gg/nJ2JH7jvmV
- [x] 2.4 Configure Discord badge to use shields.io with invite code nJ2JH7jvmV and style=flat&logo=discord

## 3. README Navigation Cleanup

- [x] 3.1 Remove "Discord" textual link from navigation paragraph (line 10)
- [x] 3.2 Remove "OpenSpec UI" textual link from navigation paragraph (line 11)
- [x] 3.3 Verify navigation paragraph contains only "Website" and "Documentation" links
- [x] 3.4 Verify Discord link is preserved in "Support and Questions" section (line 69)

## 4. Verification

- [x] 4.1 Verify Discord server widget is enabled in server settings
- [x] 4.2 Run workflow locally or check badge URLs resolve correctly
- [x] 4.3 Verify badge ordering: Deploy, Coverage, Version, License, OpenSpec Specs, OpenSpec Tasks, Discord
- [x] 4.4 Verify all badges use consistent classic/gradient style
