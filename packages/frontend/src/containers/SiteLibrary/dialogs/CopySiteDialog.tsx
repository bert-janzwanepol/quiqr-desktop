import { useState } from "react";
import service from "../../../services/service";
import { useConfigurations } from "../../../queries/hooks";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { SiteConfig } from "../../../../types";

interface CopyDialogProps {
  open: boolean;
  siteconf: SiteConfig;
  onSuccess: () => void;
  onClose: () => void;
}

const CopyDialog = ({ open, siteconf, onSuccess, onClose }: CopyDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editedName, setEditedName] = useState(siteconf.name + " (copy)");

  // Read site names directly from the TanStack Query cache — no separate fetch needed
  const { data: configurations } = useConfigurations();
  const existingNames = configurations?.sites.map(s => s.name) ?? [];

  const nameAlreadyUsed = existingNames.includes(editedName);

  const editedSiteConf = { ...siteconf, name: editedName, key: editedName };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
    setError("");
  };

  const saveSiteConf = async () => {
    if (!editedSiteConf.key || nameAlreadyUsed) return;

    setLoading(true);
    setError("");

    try {
      await service.api.copySite(siteconf.key, editedSiteConf);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy site');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description' fullWidth={true} maxWidth={"sm"}>
      <DialogTitle id='alert-dialog-title'>Copy site: {siteconf.name}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description' component='div'>
          <TextField
            id='standard-full-width'
            label='Site Name'
            fullWidth
            value={editedName}
            onChange={handleNameChange}
            error={nameAlreadyUsed}
            helperText={nameAlreadyUsed ? "Name is already used." : error}
            disabled={loading}
            sx={{ marginTop: (theme) => theme.spacing(1) }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button disabled={nameAlreadyUsed || loading} onClick={saveSiteConf}>
          {loading ? <CircularProgress size={20} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CopyDialog;
