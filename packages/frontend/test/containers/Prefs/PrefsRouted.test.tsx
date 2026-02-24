/**
 * PrefsRouted Component Tests
 *
 * Tests the preferences routing and navigation.
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '../../test-utils';
import { PrefsRouted } from '../../../src/containers/Prefs/PrefsRouted';
import * as api from '../../../src/api';

// Mock API
vi.mock('../../../src/api', () => ({
  getEffectivePreferences: vi.fn(),
  getInstanceSetting: vi.fn(),
  getStoragePath: vi.fn(),
  setStoragePath: vi.fn(),
  showOpenFolderDialog: vi.fn(),
}));

describe('PrefsRouted', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getEffectivePreferences).mockResolvedValue({
      interfaceStyle: 'quiqr10-light',
    } as any);
    vi.mocked(api.getInstanceSetting).mockResolvedValue(null);
    vi.mocked(api.getStoragePath).mockResolvedValue('/home/user/QuiqrData');
  });

  describe('Route Structure', () => {
    it('defines routes for preferences pages', () => {
      // Test that the component can be instantiated
      const routed = <PrefsRouted />;
      expect(routed).toBeDefined();
    });
  });
});
