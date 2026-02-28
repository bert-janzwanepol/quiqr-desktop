import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import { useField } from '../useField';
import { getBasePath } from '../../../utils/nestPath';
import type { NestField as NestFieldConfig, Field } from '@quiqr/types';

interface Props {
  compositeKey: string;
}

/**
 * NestField - nested field container that navigates to a nested view.
 * Click to navigate to a dedicated view showing the nested fields.
 *
 * Always renders as a folder navigation button. The parent view (SukohForm or
 * AccordionField) is responsible for rendering the children when the field is
 * the current navigation target.
 */
function NestField({ compositeKey }: Props) {
  const { field } = useField(compositeKey);
  const navigate = useNavigate();
  const location = useLocation();
  const config = field as NestFieldConfig;

  // The full path for this field (without the "root." prefix)
  const fieldPath = compositeKey.replace(/^root\./, '');

  // Build summary of child field labels (for navigation button secondary text)
  const childLabels = useMemo(() => {
    const labels = config.fields.map((f: Field) => f.title || f.key).join(', ');
    return `(${labels})`;
  }, [config.fields]);

  const handleClick = () => {
    const basePath = getBasePath(location.pathname);
    // Use the full compositeKey path (preserving array indices) as the nestPath.
    // This is critical for NestFields inside dynamic accordion items, where the
    // path includes an item index (e.g., "content_blocks[0].button").
    navigate(`${basePath}/nest/${encodeURIComponent(fieldPath)}`);
  };

  return (
    <List style={{ marginBottom: 16, padding: 0 }}>
      <ListItemButton
        onClick={handleClick}
        style={{
          padding: '20px 16px',
          border: 'solid 1px #d8d8d8',
          borderRadius: '7px',
        }}
      >
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText
          primary={config.title ?? config.key}
          secondary={childLabels}
        />
        <ChevronRightIcon />
      </ListItemButton>
    </List>
  );
}

export default NestField;
