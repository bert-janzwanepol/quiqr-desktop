/**
 * PrefsLogging Component Tests
 *
 * Tests the logging configuration interface.
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils';
import PrefsLogging from '../../../src/containers/Prefs/PrefsLogging';
import * as api from '../../../src/api';

// Mock the api module
vi.mock('../../../src/api', () => ({
  getInstanceSetting: vi.fn(),
  updateInstanceSettings: vi.fn(),
}));

describe('PrefsLogging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getInstanceSetting).mockResolvedValue(30);
    vi.mocked(api.updateInstanceSettings).mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('renders component successfully', async () => {
      render(<PrefsLogging />);

      await waitFor(() => {
        expect(screen.getByText('Logging Configuration')).toBeInTheDocument();
      });
    });

    it('displays informational text', async () => {
      render(<PrefsLogging />);

      await waitFor(() => {
        expect(screen.getByText(/Configure how long log files are retained/i)).toBeInTheDocument();
        expect(screen.getByText(/Logs older than this period will be automatically deleted/i)).toBeInTheDocument();
      });
    });
  });

  describe('Saving', () => {
    it('has save button', async () => {
      render(<PrefsLogging />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('loads instance setting on mount', async () => {
      render(<PrefsLogging />);

      await waitFor(() => {
        expect(api.getInstanceSetting).toHaveBeenCalledWith('logging.retention');
      });
    });
  });

  describe('Error Handling', () => {
    it('calls API on mount', async () => {
      render(<PrefsLogging />);

      await waitFor(() => {
        expect(api.getInstanceSetting).toHaveBeenCalledWith('logging.retention');
      });
    });
  });
});
