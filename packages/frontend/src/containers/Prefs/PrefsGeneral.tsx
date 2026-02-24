import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prefsQueryOptions, prefsMutationOptions } from '../../queries/options';
import { useAppTheme } from '../../contexts/ThemeContext';
import { useSnackbar } from '../../contexts/SnackbarContext';

function PrefsGeneral() {
  const { updateTheme } = useAppTheme();
  const queryClient = useQueryClient();
  const { addSnackMessage } = useSnackbar();

  // Query: Fetch all effective preferences using unified config API
  const { data: prefs } = useQuery(prefsQueryOptions.all());

  // Mutation: Save preference using unified config API with custom callbacks
  const savePrefMutation = useMutation({
    ...prefsMutationOptions.save(queryClient),
    onSuccess: (data, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['getEffectivePreferences'] });
      queryClient.invalidateQueries({ queryKey: ['getEffectivePreference'] });

      // Add snackbar feedback
      if (variables.prefKey === 'interfaceStyle') {
        const themeName = variables.prefValue === 'quiqr10-dark' ? 'Dark' : 'Light';
        addSnackMessage(`Interface style changed to ${themeName}`, { severity: 'success' });
      } else if (variables.prefKey === 'customOpenCommand') {
        if (variables.prefValue) {
          addSnackMessage('Custom open command saved', { severity: 'success' });
        } else {
          addSnackMessage('Custom open command cleared', { severity: 'success' });
        }
      }
    },
    onError: (error: Error, variables) => {
      if (variables.prefKey === 'interfaceStyle') {
        addSnackMessage(`Failed to change interface style: ${error.message}`, { severity: 'error' });
      } else if (variables.prefKey === 'customOpenCommand') {
        addSnackMessage(`Failed to save custom open command: ${error.message}`, { severity: 'error' });
      }
    }
  });

  const interfaceStyle = prefs?.interfaceStyle ?? 'quiqr10-light';
  const customOpenCommand = (prefs?.customOpenCommand as string | undefined) ?? '';

  // Local state for custom open command input
  const [customCommandInput, setCustomCommandInput] = useState(customOpenCommand);

  const handleInterfaceStyleChange = (value: string) => {
    // Optimistically update the theme immediately
    updateTheme(value);
    // Save to backend using unified config API
    savePrefMutation.mutate({ prefKey: 'interfaceStyle', prefValue: value });
  };

  const handleSaveCustomCommand = () => {
    const trimmedCommand = (customCommandInput as string).trim();
    savePrefMutation.mutate({
      prefKey: 'customOpenCommand',
      prefValue: trimmedCommand || undefined
    });
  };

  return (
    <Box sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h4">General Preferences</Typography>

      <Box my={2}>
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 300 }}>
          <InputLabel>Interface Style</InputLabel>
          <Select
            value={interfaceStyle}
            onChange={(e) => handleInterfaceStyleChange(e.target.value)}
            label="Interface Style"
            sx={{ minWidth: 300 }}
          >
            <MenuItem key="quiqr10" value="quiqr10-light">
              Light
            </MenuItem>
            <MenuItem key="quiqr10-dark" value="quiqr10-dark">
              Dark
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box my={2} mx={1}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Custom Open-In Command
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Configure a custom command to open sites with your preferred editor or tool.
          Use %site_path% as a placeholder for the site path and %site_name% for the site name.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <TextField
            value={customCommandInput}
            onChange={(e) => setCustomCommandInput(e.target.value)}
            placeholder='Example: code "%site_path%" or alacritty --title "%site_name%" --working-directory "%site_path%"'
            fullWidth
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleSaveCustomCommand}
            disabled={savePrefMutation.isPending}
            sx={{ mt: 0.5 }}
          >
            Save
          </Button>
        </Box>
      </Box>

    </Box>
  );
}

export default PrefsGeneral;
