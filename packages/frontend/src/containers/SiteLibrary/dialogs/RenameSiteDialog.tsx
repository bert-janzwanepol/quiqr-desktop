import { useState } from "react";
import service from "../../../services/service";
import { useConfigurations } from "../../../queries/hooks";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { SiteConfig } from '../../../../types';

interface RenameDialogProps {
  open: boolean;
  siteconf: SiteConfig;
  onSuccess: () => void;
  onClose: () => void;
}

const RenameDialog = ({ open, siteconf, onSuccess, onClose }: RenameDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedName, setEditedName] = useState(siteconf.name);

  // Read site names directly from the TanStack Query cache — no separate fetch needed
  const { data: configurations } = useConfigurations();
  const existingNames = configurations?.sites.map(s => s.name) ?? [];

  const nameAlreadyUsed = editedName !== siteconf.name && existingNames.includes(editedName);

  const editedSiteConf = { ...siteconf, name: editedName };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const saveSiteConf = async () => {
    if (!editedSiteConf.key || nameAlreadyUsed) return;

    setLoading(true);
    setError(null);

    try {
      await service.api.saveSiteConf(editedSiteConf.key, editedSiteConf);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename site');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description' fullWidth={true} maxWidth={"sm"}>
      <DialogTitle id='alert-dialog-title'>Edit site name: {siteconf.name}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          <Box>
            <TextField
              id='standard-full-width'
              label='Site Name'
              fullWidth
              value={editedName}
              onChange={handleNameChange}
              error={nameAlreadyUsed}
              helperText={nameAlreadyUsed ? "Name is already used." : ""}
              disabled={loading}
            />
          </Box>
        </DialogContentText>
        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={saveSiteConf} disabled={nameAlreadyUsed || loading}>
          {loading ? <CircularProgress size={20} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameDialog;
