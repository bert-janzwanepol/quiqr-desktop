import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instanceSettingsQueryOptions, instanceSettingsMutationOptions } from '../../queries/options';
import { useSnackbar } from '../../contexts/SnackbarContext';

function PrefsHugo() {
  const queryClient = useQueryClient();
  const { addSnackMessage } = useSnackbar();

  // Query: Fetch Hugo-specific instance settings using unified config API
  const { data: serveDraftMode } = useQuery(instanceSettingsQueryOptions.get('hugo.serveDraftMode'));
  const { data: disableAutoHugoServe } = useQuery(instanceSettingsQueryOptions.get('hugo.disableAutoHugoServe'));

  // Mutation: Save instance setting using unified config API
  const saveInstanceSettingMutation = useMutation({
    ...instanceSettingsMutationOptions.set(queryClient),
    onSuccess: (data, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['getInstanceSettings'] });
      queryClient.invalidateQueries({ queryKey: ['getInstanceSetting'] });

      // Add snackbar feedback
      if (variables.path === 'hugo.serveDraftMode') {
        const state = variables.value ? 'enabled' : 'disabled';
        addSnackMessage(`Hugo draft mode ${state}`, { severity: 'success' });
      } else if (variables.path === 'hugo.disableAutoHugoServe') {
        const state = variables.value ? 'disabled' : 'enabled';
        addSnackMessage(`Hugo auto serve ${state}`, { severity: 'success' });
      }
    },
    onError: (error: Error, variables) => {
      addSnackMessage(`Failed to update Hugo setting: ${error.message}`, { severity: 'error' });
    }
  });

  const serveDraftModeEnabled = Boolean(serveDraftMode);
  const disableAutoHugoServeEnabled = Boolean(disableAutoHugoServe);

  const handleServeDraftModeChange = (checked: boolean) => {
    saveInstanceSettingMutation.mutate({ path: 'hugo.serveDraftMode', value: checked });
  };

  const handleDisableAutoHugoServeChange = (checked: boolean) => {
    saveInstanceSettingMutation.mutate({ path: 'hugo.disableAutoHugoServe', value: checked });
  };

  return (
    <Box sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h4">Hugo Settings</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Hugo-specific configuration for static site generation and serving.
      </Typography>

      <Box my={2}>
        <FormControlLabel
          control={
            <Switch
              checked={serveDraftModeEnabled}
              onChange={(e) => handleServeDraftModeChange(e.target.checked)}
              disabled={saveInstanceSettingMutation.isPending}
            />
          }
          label="Serve Draft Content"
        />
        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block' }}>
          When enabled, Hugo serve processes will include draft content. Changes take effect on next serve start.
        </Typography>
      </Box>

      <Box my={2}>
        <FormControlLabel
          control={
            <Switch
              checked={disableAutoHugoServeEnabled}
              onChange={(e) => handleDisableAutoHugoServeChange(e.target.checked)}
              disabled={saveInstanceSettingMutation.isPending}
            />
          }
          label="Disable Auto Hugo Serve"
        />
        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block' }}>
          When enabled, Hugo will NOT automatically start serve processes when opening workspaces.
        </Typography>
      </Box>

    </Box>
  );
}

export default PrefsHugo;
