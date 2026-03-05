import { FullConfig } from '@playwright/test';
import path from 'path';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';

/**
 * Global setup for Playwright Electron testing
 *
 * This file handles:
 * - Building packages for production-mode testing
 * - Setting up test fixtures and data
 */

async function globalSetup(_config: FullConfig) {
  console.log('🚀 Setting up Quiqr Desktop E2E tests...');

  // Build packages for production testing (without packaging to AppImage)
  console.log('📦 Building packages for E2E testing...');
  await new Promise<void>((resolve, reject) => {
    const buildCommand = 'npm run build -w @quiqr/types && npm run build -w @quiqr/backend && npm run build -w @quiqr/adapter-electron && npm run build -w @quiqr/adapter-standalone && npm run build -w @quiqr/frontend';
    const buildProcess = spawn(buildCommand, {
      stdio: 'inherit',
      cwd: process.cwd(),
      shell: true,
    });

    buildProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });

  // Set up test data directory
  const testDataDir = path.join(process.cwd(), 'e2e', 'test-data');
  await fs.mkdir(testDataDir, { recursive: true });

  // Create minimal test sites for different SSGs
  await createTestSites(testDataDir);

  console.log('✅ E2E setup complete');
}

async function createTestSites(testDataDir: string) {
  // Create a minimal Hugo test site
  const hugoSiteDir = path.join(testDataDir, 'hugo-test-site');
  await fs.mkdir(hugoSiteDir, { recursive: true });

  // Create basic Hugo config
  await fs.writeFile(
    path.join(hugoSiteDir, 'config.toml'),
    `
baseURL = "http://localhost:1313"
languageCode = "en-us"
title = "Test Hugo Site"

[params]
  description = "A test site for E2E testing"
`
  );

  // Create content directory and sample post
  const contentDir = path.join(hugoSiteDir, 'content');
  await fs.mkdir(contentDir, { recursive: true });

  await fs.writeFile(
    path.join(contentDir, 'test-post.md'),
    `---
title: "Test Post"
date: 2024-01-01T00:00:00Z
draft: false
---

# Test Post

This is a test post for E2E testing.
`
  );

  // Create Jekyll test site
  const jekyllSiteDir = path.join(testDataDir, 'jekyll-test-site');
  await fs.mkdir(jekyllSiteDir, { recursive: true });

  await fs.writeFile(
    path.join(jekyllSiteDir, '_config.yml'),
    `
title: Test Jekyll Site
description: A test site for E2E testing
baseurl: ""
url: "http://localhost:4000"

markdown: kramdown
highlighter: rouge
`
  );

  // Create Jekyll post
  const jekyllPostsDir = path.join(jekyllSiteDir, '_posts');
  await fs.mkdir(jekyllPostsDir, { recursive: true });

  await fs.writeFile(
    path.join(jekyllPostsDir, '2024-01-01-test-post.md'),
    `---
layout: post
title: "Test Post"
date: 2024-01-01 00:00:00 +0000
categories: test
---

# Test Post

This is a test post for E2E testing.
`
  );

  console.log('📝 Created test sites for Hugo and Jekyll');
}

export default globalSetup;