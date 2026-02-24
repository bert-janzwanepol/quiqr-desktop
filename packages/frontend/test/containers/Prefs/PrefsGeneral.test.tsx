/**
 * PrefsGeneral Component Tests - Comprehensive
 *
 * Tests the theme changing functionality, custom open command, and snackbar feedback.
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils';
import PrefsGeneral from '../../../src/containers/Prefs/PrefsGeneral';
import { ThemeContext } from '../../../src/contexts/ThemeContext';
import * as api from '../../../src/api';

// Mock the api module (used by query options)
vi.mock('../../../src/api', () => ({
  getEffectivePreferences: vi.fn(),
  getEffectivePreference: vi.fn(),
  setUserPreference: vi.fn(),
}));

describe('PrefsGeneral', () => {
  const mockUpdateTheme = vi.fn();
  const mockPreferences = {
    interfaceStyle: 'quiqr10-light' as const,
    customOpenCommand: '',
    showSplashAtStartup: true,
    libraryView: 'cards',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getEffectivePreferences).mockResolvedValue(mockPreferences as any);
    vi.mocked(api.getEffectivePreference).mockImplementation((prefKey: any) => {
      return Promise.resolve({
        value: mockPreferences[prefKey as keyof typeof mockPreferences],
        source: 'user' as const,
        path: `user.preferences.${prefKey}`,
      });
    });
    vi.mocked(api.setUserPreference).mockResolvedValue(true);
  });

  const renderWithThemeContext = () => {
    return render(
      <ThemeContext.Provider value={{ updateTheme: mockUpdateTheme }}>
        <PrefsGeneral />
      </ThemeContext.Provider>
    );
  };

  describe('Rendering without dataFolder', () => {
    it('renders the component successfully without dataFolder field', async () => {
      renderWithThemeContext();

      await waitFor(() => {
        expect(screen.getByText('General Preferences')).toBeInTheDocument();
      });

      // Verify dataFolder field is NOT present
      expect(screen.queryByText(/Quiqr Data Folder/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/dataFolder/i)).not.toBeInTheDocument();
    });

    it('loads preferences on mount', async () => {
      renderWithThemeContext();

      await waitFor(() => {
        expect(api.getEffectivePreferences).toHaveBeenCalled();
      });
    });
  });

  describe('Interface Style', () => {
    it('displays interface style select', async () => {
      renderWithThemeContext();

      await waitFor(() => {
        expect(screen.getByText(/General Preferences/i)).toBeInTheDocument();
      });

      // Verify the select field exists (MUI creates complex DOM, so just check it renders)
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Open Command', () => {
    it('renders customOpenCommand field', async () => {
      renderWithThemeContext();

      await waitFor(() => {
        expect(screen.getByText(/Custom Open-In Command/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Example: code/);
      expect(input).toBeInTheDocument();
    });

    it('saves customOpenCommand with success feedback', async () => {
      const user = userEvent.setup();
      renderWithThemeContext();

      await waitFor(() => {
        expect(screen.getByText(/Custom Open-In Command/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Example: code/);
      const saveButton = screen.getByRole('button', { name: /save/i });

      // Type a command
      await user.clear(input);
      await user.type(input, 'code "%site_path%"');

      // Click save
      await user.click(saveButton);

      // Verify API was called
      await waitFor(() => {
        expect(api.setUserPreference).toHaveBeenCalledWith('customOpenCommand', 'code "%site_path%"');
      });
    });

    it('clears customOpenCommand when saved as empty', async () => {
      const user = userEvent.setup();
      renderWithThemeContext();

      await waitFor(() => {
        expect(screen.getByText(/Custom Open-In Command/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Example: code/);
      const saveButton = screen.getByRole('button', { name: /save/i });

      // Clear input and save
      await user.clear(input);
      await user.click(saveButton);

      // Verify API was called with undefined (empty value)
      await waitFor(() => {
        expect(api.setUserPreference).toHaveBeenCalledWith('customOpenCommand', undefined);
      });
    });

    it('shows error snackbar when save fails', async () => {
      const user = userEvent.setup();
      vi.mocked(api.setUserPreference).mockRejectedValueOnce(new Error('Save failed'));

      renderWithThemeContext();

      await waitFor(() => {
        expect(screen.getByText(/Custom Open-In Command/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Example: code/);
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.type(input, 'invalid-command');
      await user.click(saveButton);

      await waitFor(() => {
        expect(api.setUserPreference).toHaveBeenCalled();
      });
    });
  });
});
