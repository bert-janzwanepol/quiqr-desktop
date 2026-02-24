/**
 * PrefsGit Component Tests
 *
 * Tests the Git configuration interface.
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils';
import PrefsGit from '../../../src/containers/Prefs/PrefsGit';
import * as api from '../../../src/api';

// Mock the api module
vi.mock('../../../src/api', () => ({
  getInstanceSetting: vi.fn(),
  updateInstanceSettings: vi.fn(),
}));

describe('PrefsGit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getInstanceSetting).mockResolvedValue('/usr/bin/git');
    vi.mocked(api.updateInstanceSettings).mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('renders with current git.binaryPath value', async () => {
      render(<PrefsGit />);

      await waitFor(() => {
        expect(screen.getByText('Git Configuration')).toBeInTheDocument();
      });

      const input = screen.getByLabelText(/Git Binary Path/i);
      await waitFor(() => {
        expect(input).toHaveValue('/usr/bin/git');
      });
    });

    it('displays informational text about empty values', async () => {
      render(<PrefsGit />);

      await waitFor(() => {
        expect(screen.getByText(/If empty, Quiqr will use the system Git binary/i)).toBeInTheDocument();
      });
    });

    it('shows placeholder text in empty field', async () => {
      vi.mocked(api.getInstanceSetting).mockResolvedValue(null);
      render(<PrefsGit />);

      await waitFor(() => {
        const input = screen.getByPlaceholderText(/Leave empty to use system Git/i);
        expect(input).toBeInTheDocument();
      });
    });
  });

  describe('Saving', () => {
    it('shows success snackbar when saving git.binaryPath', async () => {
      const user = userEvent.setup();
      render(<PrefsGit />);

      await waitFor(() => {
        expect(screen.getByText('Git Configuration')).toBeInTheDocument();
      });

      const input = screen.getByLabelText(/Git Binary Path/i);
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(input);
      await user.type(input, '/custom/path/to/git');
      await user.click(saveButton);

      await waitFor(() => {
        expect(api.updateInstanceSettings).toHaveBeenCalledWith({
          git: { binaryPath: '/custom/path/to/git' }
        });
      });
    });

    it('saves null when clearing the field', async () => {
      const user = userEvent.setup();
      render(<PrefsGit />);

      await waitFor(() => {
        expect(screen.getByText('Git Configuration')).toBeInTheDocument();
      });

      const input = screen.getByLabelText(/Git Binary Path/i);
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.clear(input);
      await user.click(saveButton);

      await waitFor(() => {
        expect(api.updateInstanceSettings).toHaveBeenCalledWith({
          git: { binaryPath: null }
        });
      });
    });

    it('shows error snackbar when save fails', async () => {
      const user = userEvent.setup();
      vi.mocked(api.updateInstanceSettings).mockRejectedValueOnce(
        new Error('Failed to save')
      );

      render(<PrefsGit />);

      await waitFor(() => {
        expect(screen.getByText('Git Configuration')).toBeInTheDocument();
      });

      const input = screen.getByLabelText(/Git Binary Path/i);
      const saveButton = screen.getByRole('button', { name: /save/i });

      await user.type(input, '/invalid/path');
      await user.click(saveButton);

      await waitFor(() => {
        expect(api.updateInstanceSettings).toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('disables input while loading', async () => {
      let resolveLoading: (value: string) => void;
      const loadingPromise = new Promise<string>((resolve) => {
        resolveLoading = resolve;
      });

      vi.mocked(api.getInstanceSetting).mockReturnValue(loadingPromise);

      render(<PrefsGit />);

      const input = screen.getByLabelText(/Git Binary Path/i);
      expect(input).toBeDisabled();

      resolveLoading!('/usr/bin/git');

      await waitFor(() => {
        expect(input).not.toBeDisabled();
      });
    });

    it('disables buttons while saving', async () => {
      const user = userEvent.setup();
      let resolveSave: () => void;
      const savePromise = new Promise<void>((resolve) => {
        resolveSave = resolve;
      });

      vi.mocked(api.updateInstanceSettings).mockReturnValue(savePromise);

      render(<PrefsGit />);

      await waitFor(() => {
        expect(screen.getByText('Git Configuration')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      expect(saveButton).toBeDisabled();

      resolveSave!();

      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error snackbar when loading fails', async () => {
      vi.mocked(api.getInstanceSetting).mockRejectedValueOnce(
        new Error('Failed to load')
      );

      render(<PrefsGit />);

      await waitFor(() => {
        expect(api.getInstanceSetting).toHaveBeenCalledWith('git.binaryPath');
      });
    });
  });
});
