import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prefsQueryOptions, prefsMutationOptions } from '../../queries/options';

function PrefsAdvanced() {
  const queryClient = useQueryClient();

  // Query: Fetch all effective preferences using unified config API
  const { data: prefs } = useQuery(prefsQueryOptions.all());

  // Mutation: Save preference using unified config API
  const savePrefMutation = useMutation(prefsMutationOptions.save(queryClient));

  const customOpenInCommand = prefs?.customOpenInCommand ?? '';
  const systemGitBinPath = prefs?.systemGitBinPath ?? '';
  const logRetentionDays = prefs?.logRetentionDays ?? 30;

  const handleCustomOpenInCommandChange = (value: string) => {
    savePrefMutation.mutate({ prefKey: 'customOpenInCommand', prefValue: value });
  };

  const handleSystemGitBinPathChange = (value: string) => {
    savePrefMutation.mutate({ prefKey: 'systemGitBinPath', prefValue: value });
  };

  const handleLogRetentionDaysChange = (value: string) => {
    const days = parseInt(value, 10);
    if (!isNaN(days) && days >= 0 && days <= 365) {
      savePrefMutation.mutate({ prefKey: 'logRetentionDays', prefValue: days });
    }
  };

  return (
    <Box sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h4">Advanced Preferences</Typography>

      <TextField
        id="openInCommand"
        label="Custom open-in-command"
        helperText='Command to open directory in. E.g. alacritty --title "%site_name" --working-directory "%site_path"'
        variant="outlined"
        sx={{ m: 1, minWidth: 400 }}
        value={customOpenInCommand}
        onChange={(e) => handleCustomOpenInCommandChange(e.target.value)}
      />

      <TextField
        id="gitBinary"
        label="Path to git binary"
        helperText="Providing a path to an installed version of git enables the real git sync target"
        variant="outlined"
        sx={{ m: 1, minWidth: 400 }}
        value={systemGitBinPath}
        onChange={(e) => handleSystemGitBinPathChange(e.target.value)}
      />

      <TextField
        id="logRetentionDays"
        label="Log Retention (days)"
        helperText="Number of days to keep log files (0 = never delete, 7-365 = auto-delete after N days). Default: 30"
        variant="outlined"
        type="number"
        sx={{ m: 1 }}
        value={logRetentionDays}
        onChange={(e) => handleLogRetentionDaysChange(e.target.value)}
        inputProps={{ min: 0, max: 365, step: 1 }}
      />
    </Box>
  );
}

export default PrefsAdvanced;
