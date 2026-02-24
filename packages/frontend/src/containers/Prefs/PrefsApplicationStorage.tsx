import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FolderIcon from '@mui/icons-material/Folder';
import { getStoragePath, setStoragePath, showOpenFolderDialog } from '../../api';
import { useSnackbar } from '../../contexts/SnackbarContext';

function PrefsApplicationStorage() {
  const { addSnackMessage } = useSnackbar();
  const [storagePath, setStoragePathState] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Load storage path on mount
  useEffect(() => {
    loadStoragePath();
  }, []);

  const loadStoragePath = async () => {
    try {
      setLoading(true);
      const response = await getStoragePath();
      setStoragePathState(response.path || '~/Quiqr');
    } catch (error) {
      console.error('Failed to load storage path:', error);
      addSnackMessage('Failed to load storage path', { severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePath = async () => {
    try {
      const response = await showOpenFolderDialog();
      if (response.selectedFolder) {
        await handleSavePath(response.selectedFolder);
      }
    } catch (error) {
      console.error('Failed to open folder dialog:', error);
      addSnackMessage(`Failed to open folder selection dialog: ${(error as Error).message}`, {
        severity: 'error'
      });
    }
  };

  const handleSavePath = async (newPath: string) => {
    try {
      setSaving(true);

      await setStoragePath(newPath);
      setStoragePathState(newPath);
      addSnackMessage('Storage path updated successfully. Restart may be required for changes to take effect.', {
        severity: 'info',
        autoHideDuration: 6000
      });
    } catch (error) {
      console.error('Failed to save storage path:', error);
      addSnackMessage(`Failed to save storage path: ${(error as Error).message}`, {
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h4">Storage</Typography>

      <Box my={2} mx={1}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configure the location where Quiqr stores application data, sites, and workspaces.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <TextField
            label="Storage Path"
            value={storagePath}
            disabled={loading}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<FolderIcon />}
            onClick={handleChangePath}
            disabled={loading || saving}
            sx={{ mt: 1 }}
          >
            Change Path
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Note: This is an application-level setting. In Electron edition, it affects the entire application.
          Changes may require restarting the application to take full effect.
        </Typography>
      </Box>
    </Box>
  );
}

export default PrefsApplicationStorage;
