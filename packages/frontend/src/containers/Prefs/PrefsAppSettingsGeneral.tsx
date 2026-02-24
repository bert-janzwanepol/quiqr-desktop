import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instanceSettingsQueryOptions, instanceSettingsMutationOptions } from '../../queries/options';
import { useSnackbar } from '../../contexts/SnackbarContext';
import service from '../../services/service';

function PrefsAppSettingsGeneral() {
  const queryClient = useQueryClient();
  const { addSnackMessage } = useSnackbar();

  // Query: Fetch instance settings using unified config API
  const { data: experimentalFeatures } = useQuery(instanceSettingsQueryOptions.get('experimentalFeatures'));

  // Mutation: Save instance setting using unified config API
  const saveInstanceSettingMutation = useMutation({
    ...instanceSettingsMutationOptions.set(queryClient),
    onSuccess: async (data, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['getInstanceSettings'] });
      queryClient.invalidateQueries({ queryKey: ['getInstanceSetting'] });

      // Refresh menu state for standalone mode (forces menu to rebuild with new experimental features state)
      if (variables.path === 'experimentalFeatures') {
        // Wait a bit to ensure backend has rebuilt the menu
        await new Promise(resolve => setTimeout(resolve, 100));
        // Dispatch custom event to trigger menu refresh
        window.dispatchEvent(new CustomEvent('menu-state-changed'));
      }

      // Add snackbar feedback
      if (variables.path === 'experimentalFeatures') {
        const state = variables.value ? 'enabled' : 'disabled';
        addSnackMessage(`Experimental features ${state}`, { severity: 'success' });
      }
    },
    onError: (error: Error, variables) => {
      if (variables.path === 'experimentalFeatures') {
        addSnackMessage(`Failed to update experimental features: ${error.message}`, { severity: 'error' });
      }
    }
  });

  const experimentalFeaturesEnabled = Boolean(experimentalFeatures);

  const handleExperimentalFeaturesChange = (checked: boolean) => {
    saveInstanceSettingMutation.mutate({ path: 'experimentalFeatures', value: checked });
  };

  return (
    <Box sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h4">Feature Flags</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Enable or disable experimental and preview features.
      </Typography>

      <Box my={2}>
        <FormControlLabel
          control={
            <Switch
              checked={experimentalFeaturesEnabled}
              onChange={(e) => handleExperimentalFeaturesChange(e.target.checked)}
              disabled={saveInstanceSettingMutation.isPending}
            />
          }
          label="Enable Experimental Features"
        />
        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block' }}>
          Enables experimental and preview features that are still under development. Use with caution.
        </Typography>
      </Box>

    </Box>
  );
}

export default PrefsAppSettingsGeneral;
