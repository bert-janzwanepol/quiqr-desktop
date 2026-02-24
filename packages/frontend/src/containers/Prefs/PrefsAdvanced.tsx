import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prefsQueryOptions, prefsMutationOptions } from '../../queries/options';
import { useSnackbar } from '../../contexts/SnackbarContext';

function PrefsAdvanced() {
  const queryClient = useQueryClient();
  const { addSnackMessage } = useSnackbar();

  // Query: Fetch all effective preferences using unified config API
  const { data: prefs } = useQuery(prefsQueryOptions.all());

  // Mutation: Save preference using unified config API
  const savePrefMutation = useMutation(prefsMutationOptions.save(queryClient));

  const applicationRole = (prefs?.applicationRole as string | undefined) ?? 'contentEditor';

  const handleRoleChange = (value: string) => {
    savePrefMutation.mutate({ prefKey: 'applicationRole', prefValue: value }, {
      onSuccess: () => {
        const roleName = value === 'contentEditor' ? 'Content Editor' : 'Site Developer';
        addSnackMessage(`Application role changed to ${roleName}. Please reload workspace to see changes.`, { severity: 'success', autoHideDuration: 5000 });
      }
    });
  };

  return (
    <Box sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h4">Behaviour</Typography>

      <Box my={2}>
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 400 }}>
          <InputLabel>Application Role</InputLabel>
          <Select
            value={applicationRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            label="Application Role"
            sx={{ minWidth: 400 }}
          >
            <MenuItem value="contentEditor">Content Editor</MenuItem>
            <MenuItem value="siteDeveloper">Site Developer</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, display: 'block' }}>
          Controls which menu items and features are visible in the workspace. Site Developer role shows all features including advanced development tools.
        </Typography>
      </Box>

    </Box>
  );
}

export default PrefsAdvanced;
