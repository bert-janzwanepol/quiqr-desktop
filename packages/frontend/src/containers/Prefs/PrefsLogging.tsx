import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { getInstanceSetting, updateInstanceSettings } from '../../api';
import { useSnackbar } from '../../contexts/SnackbarContext';

function PrefsLogging() {
  const { addSnackMessage } = useSnackbar();
  const [logRetention, setLogRetention] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Load log retention on mount
  useEffect(() => {
    loadLogRetention();
  }, []);

  const loadLogRetention = async () => {
    try {
      setLoading(true);
      const retention = await getInstanceSetting('logging.retention');
      setLogRetention((retention as number) || 30);
    } catch (error) {
      console.error('Failed to load log retention:', error);
      addSnackMessage('Failed to load log retention', { severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateInstanceSettings({
        logging: { retention: logRetention } as any
      });

      addSnackMessage(`Log retention updated to ${logRetention} days`, {
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to save log retention:', error);
      addSnackMessage(`Failed to update log retention: ${(error as Error).message}`, {
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h4">Logging Configuration</Typography>

      <Box my={2} mx={1}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configure how long log files are retained before being automatically deleted.
        </Typography>

        <Box sx={{ mb: 2 }}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Log Retention</InputLabel>
            <Select
              value={logRetention}
              onChange={(e) => setLogRetention(e.target.value as number)}
              label="Log Retention"
              disabled={loading}
            >
              <MenuItem value={7}>7 days</MenuItem>
              <MenuItem value={30}>30 days</MenuItem>
              <MenuItem value={90}>90 days</MenuItem>
              <MenuItem value={365}>365 days (1 year)</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Logs older than this period will be automatically deleted to save disk space.
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
          Note: This is an application-level setting that affects all logging operations.
        </Typography>
      </Box>
    </Box>
  );
}

export default PrefsLogging;
