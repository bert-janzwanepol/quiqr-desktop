import { useNavigate } from "react-router";
import { useInvalidateConfigurations } from "../../queries/hooks";
import { ToolbarButton } from "../TopToolbarRight";
import AppsIcon from "@mui/icons-material/Apps";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import InputIcon from "@mui/icons-material/Input";
import AddIcon from "@mui/icons-material/Add";
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import { useDialog } from "../../hooks/useDialog";
import { useToolbarActiveStates } from "../../hooks/useToolbarActiveStates";

interface SiteLibraryToolbarItemsProps {
  activeLibraryView?: string;
  handleChange?: (viewName: string) => void;
}

/**
 * Hook that returns the toolbar button arrays for the Site Library view.
 * Use this with the new AppLayout toolbar prop.
 */
export const useSiteLibraryToolbarItems = ({
  activeLibraryView,
  handleChange,
}: SiteLibraryToolbarItemsProps) => {
  const navigate = useNavigate();
  const { openDialog } = useDialog();
  const invalidateConfigurations = useInvalidateConfigurations();

  // Get active states from shared hook
  const { isSiteLibraryActive, isApplicationLogsActive, isPreferencesActive } = useToolbarActiveStates();

  const leftItems = [
    <ToolbarButton
      key='buttonNewSite'
      action={() => openDialog('NewSlashImportSiteDialog', {
        newOrImport: 'new',
        mountSite: (siteKey: string) => {
          navigate(`/sites/${siteKey}/workspaces/main`);
        },
        onSuccess: invalidateConfigurations,
      })}
      title='New'
      icon={AddIcon}
    />,
    <ToolbarButton
      key='buttonImportSite'
      action={() => openDialog('NewSlashImportSiteDialog', {
        newOrImport: 'import',
        mountSite: (siteKey: string) => {
          navigate(`/sites/${siteKey}/workspaces/main`);
        },
        onSuccess: invalidateConfigurations,
      })}
      title='Import'
      icon={InputIcon}
    />,
  ];

  // Center items removed - view mode now controlled via Preferences > Appearance
  const centerItems: JSX.Element[] = [];

  const rightItems = [
    <ToolbarButton
      key={"toolbarbutton-library"}
      active={isSiteLibraryActive}
      action={() => navigate("/sites/last")}
      title='Site Library'
      icon={AppsIcon}
    />,
    <ToolbarButton
      key='buttonApplicationLogs'
      active={isApplicationLogsActive}
      action={() => navigate("/logs/application")}
      title='Application Logs'
      icon={DeveloperModeIcon}
    />,
    <ToolbarButton
      key='buttonPrefs'
      active={isPreferencesActive}
      action={() => navigate("/prefs/")}
      title='Preferences'
      icon={SettingsApplicationsIcon}
    />,
  ];

  return { leftItems, centerItems, rightItems };
};
