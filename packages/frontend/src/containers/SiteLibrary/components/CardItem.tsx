import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import ScreenShotPlaceholder from '../../../img-assets/screenshot-placeholder.png';
import { SiteConfig } from '../../../../types';
import { bundleQueryOptions } from '../../../queries/options';

interface CardItemProps {
  site: SiteConfig;
  siteClick: () => void;
  itemMenuButton?: React.ReactNode;
  itemMenuItems?: React.ReactNode;
}

function CardItem({ site, siteClick, itemMenuButton, itemMenuItems }: CardItemProps) {
  const screenshotPath = site.etalage?.screenshots?.[0];
  const faviconPath = site.etalage?.favicons?.[0];

  const { data: screenshotData } = useQuery({
    ...bundleQueryOptions.thumbnail(site.key, 'source', screenshotPath ?? ''),
    enabled: !site.screenshotURL && !!screenshotPath,
    staleTime: Infinity,
  });

  const { data: faviconData } = useQuery({
    ...bundleQueryOptions.thumbnail(site.key, 'source', faviconPath ?? ''),
    enabled: !!faviconPath,
    staleTime: Infinity,
  });

  const screenshot = site.screenshotURL ?? screenshotData ?? ScreenShotPlaceholder;
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
      {itemMenuItems}
      <Card elevation={5} sx={{ width: 345 }}>
        <CardHeader
          avatar={siteAvatar}
          action={itemMenuButton}
          title={<div onClick={siteClick}>{site.name}</div>}
          subheader=""
        />
        <CardActionArea>
          <CardMedia
            onClick={siteClick}
            sx={{ height: 0, paddingTop: '56.25%', backgroundColor: '#ccc' }}
            image={screenshot}
            title="Site screenshot"
          />
        </CardActionArea>
      </Card>
    </>
  );
}

export default CardItem;


