import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import { SiteConfig } from '../../../../types';
import { bundleQueryOptions } from '../../../queries/options';

interface SiteListItemProps {
  site: SiteConfig;
  siteClick: () => void;
  itemMenuButton?: React.ReactNode;
  itemMenuItems?: React.ReactNode;
}

function SiteListItem({ site, siteClick, itemMenuButton, itemMenuItems }: SiteListItemProps) {
  const faviconPath = site.etalage?.favicons?.[0];

  const { data: faviconData } = useQuery({
    ...bundleQueryOptions.thumbnail(site.key, 'source', faviconPath ?? ''),
    enabled: !!faviconPath,
    staleTime: Infinity,
  });

  const favicon = faviconData ?? '';

  const siteAvatar =
    favicon !== '' ? (
      <Avatar aria-label="recipe" variant="rounded" src={favicon} />
    ) : (
      <Avatar aria-label="recipe" variant="rounded" sx={{ backgroundColor: red[500] }}>
        {site.name.charAt(0)}
      </Avatar>
    );

  return (
    <>
      <ListItem
        id={'list-siteselectable-' + site.name}
        key={'sitelistitem-' + site.key}
        disablePadding
        secondaryAction={site.remote ? null : itemMenuButton}
      >
        <ListItemButton onClick={siteClick}>
          <ListItemAvatar>{siteAvatar}</ListItemAvatar>
          <ListItemText primary={site.name} />
        </ListItemButton>
      </ListItem>
      {itemMenuItems}
    </>
  );
}

export default SiteListItem;
