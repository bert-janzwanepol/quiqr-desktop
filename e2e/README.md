# Quiqr Desktop E2E Tests

End-to-end tests for critical user workflows using Playwright with production-mode Electron builds.

## Structure

```
e2e/
├── tests/                     # Test files (*.electron.spec.ts)
│   ├── hugo-workflow.electron.spec.ts
│   └── jekyll-workflow.electron.spec.ts
├── utils/                     # Test utilities and helpers
│   └── electron-utils.ts
├── fixtures/                  # Test data and fixtures
├── global-setup.ts           # Global test setup
├── global-teardown.ts        # Global test cleanup
└── README.md                 # This file
```

## Running Tests

**Important:** E2E tests build packages and run Electron in production mode. This gives production-like behavior (built frontend, Express serving) while allowing Playwright to instrument the process.

```bash
# Run all E2E tests (builds packages first)
npm run test:e2e

# Run specific test file
npm run test:e2e -- hugo-workflow.electron.spec.ts

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug
```

**Why not test the AppImage directly?**
Playwright needs to connect to Electron via Chrome DevTools Protocol. Packaged executables make this connection difficult due to sandboxing and process isolation. Testing in production mode gives us 95% of the same behavior without the instrumentation issues.

## Test Philosophy

These tests follow the testing strategy defined in `openspec/specs/testing-strategy/spec.md`:

- **Focus on critical workflows**: Import → Edit → Build → Deploy
- **Test cross-platform behavior**: Path handling, file operations
- **Multi-provider scenarios**: Hugo, Jekyll, Eleventy
- **Error handling**: Graceful degradation and user feedback

## Test Data

Test sites are automatically generated in `e2e/test-data/`:
- `hugo-test-site/` - Minimal Hugo site with config and content
- `jekyll-test-site/` - Basic Jekyll site with posts and config

## Writing New Tests

1. Create test files with `.electron.spec.ts` extension
2. Use the utilities from `electron-utils.ts`
3. Follow the test patterns in existing files
4. Focus on user-visible behavior, not implementation details

## Debugging

- Screenshots are taken on test failures
- Videos are recorded for failed tests
- Traces are available for retried tests
- Use `test.only()` to run specific tests during development