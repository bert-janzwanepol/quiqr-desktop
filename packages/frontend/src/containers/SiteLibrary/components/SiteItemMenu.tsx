import React, { useState, useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useQuery } from '@tanstack/react-query';
import { SiteConfig } from '../../../../types';
import { openExternal } from '../../../utils/platform';
import { executeCustomOpenCommand } from '../../../api';
import { prefsQueryOptions } from '../../../queries/options';
import { useSnackbar } from '../../../contexts/SnackbarContext';

interface SiteItemMenuProps {
  site: SiteConfig;
  onMenuAction: (action: string, site: SiteConfig) => void;
}

const SiteItemMenu = ({ site, onMenuAction } : SiteItemMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { addSnackMessage } = useSnackbar();

  // Query for custom open command preference
  const { data: prefs } = useQuery(prefsQueryOptions.all());
  const customOpenCommand = prefs?.customOpenCommand;

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleAction = useCallback((action: string) => {
    handleClose();
    onMenuAction(action, site);
  }, [handleClose, onMenuAction, site]);

  const handleOpenInCustom = useCallback(async () => {
    handleClose();
    if (!customOpenCommand) return;

    try {
      await executeCustomOpenCommand(site.key, customOpenCommand);
      addSnackMessage(`Opened site in ${customOpenCommand.split(' ')[0]}`, { severity: 'success' });
    } catch (error) {
      addSnackMessage(`Failed to open site: ${(error as Error).message}`, { severity: 'error' });
    }
  }, [customOpenCommand, site.key, addSnackMessage, handleClose]);

  const menuButton = (
    <IconButton
      onClick={handleClick}
      aria-label='more'
      aria-controls='long-menu'
      aria-haspopup='true'
      size='large'>
      <MoreVertIcon />
    </IconButton>
  );

  const menuItems = site.template ? (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      keepMounted
      onClose={handleClose}>
      <MenuItem key='import' onClick={() => handleAction('import')}>
        Import
      </MenuItem>

      <MenuItem
        key='visit'
        onClick={async () => {
          handleClose();
          await openExternal(site.homepageURL);
        }}>
        Open Homepage
      </MenuItem>
    </Menu>
  ) : (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      keepMounted
      onClose={handleClose}>
      {customOpenCommand && (
        <MenuItem key='openInCustom' onClick={handleOpenInCustom}>
          Open In...
        </MenuItem>
      )}

      <MenuItem key='rename' onClick={() => handleAction('rename')}>
        Rename
      </MenuItem>

      <MenuItem key='copy' onClick={() => handleAction('copy')}>
        Copy
      </MenuItem>

      <MenuItem key='tags' onClick={() => handleAction('editTags')}>
        Edit Tags
      </MenuItem>

      <MenuItem key='delete' onClick={() => handleAction('delete')}>
        Delete
      </MenuItem>
    </Menu>
  );

  return (
    <>
      {menuButton}
      {menuItems}
    </>
  );
};

export default SiteItemMenu;
