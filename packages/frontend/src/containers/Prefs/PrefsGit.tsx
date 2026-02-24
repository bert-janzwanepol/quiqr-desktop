import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { getInstanceSetting, updateInstanceSettings } from '../../api';
import { useSnackbar } from '../../contexts/SnackbarContext';

function PrefsGit() {
  const { addSnackMessage } = useSnackbar();
  const [gitBinaryPath, setGitBinaryPath] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Load Git binary path on mount
  useEffect(() => {
    loadGitBinaryPath();
  }, []);

  const loadGitBinaryPath = async () => {
    try {
      setLoading(true);
      const path = await getInstanceSetting('git.binaryPath');
      setGitBinaryPath((path as string | null) ?? '');
    } catch (error) {
      console.error('Failed to load Git binary path:', error);
      addSnackMessage('Failed to load Git binary path', { severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateInstanceSettings({
        git: { binaryPath: gitBinaryPath.trim() || null }
      });

      addSnackMessage('Git binary path updated', {
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to save Git binary path:', error);
      addSnackMessage(`Failed to update Git binary path: ${(error as Error).message}`, {
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h4">Git Configuration</Typography>

      <Box my={2} mx={1}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configure the path to the Git binary used by Quiqr for Git operations.
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Git Binary Path"
            value={gitBinaryPath}
            onChange={(e) => setGitBinaryPath(e.target.value)}
            disabled={loading}
            fullWidth
            placeholder="Leave empty to use system Git"
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            If empty, Quiqr will use the system Git binary from PATH.
            Specify a custom path if you want to use a specific Git installation.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || saving}
        >
          Save
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Note: This is an application-level setting that affects all Git operations.
        </Typography>
      </Box>
    </Box>
  );
}

export default PrefsGit;
