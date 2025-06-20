import * as React        from 'react';
import FolderIcon from '@mui/icons-material/Folder';
export default class Meta {

  static configDialogTitle = "Folder Export Target";
  static syncingText = "Syncing to folder";

  static sidebarLabel(config){
    return config.path;
  }
  static icon(){
    return <FolderIcon />;
  }
}
