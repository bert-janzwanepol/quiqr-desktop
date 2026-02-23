import Sidebar from './../Sidebar';

interface PrefsSidebarProps {
  menus?: unknown[];
  hideItems?: boolean;
  menuIsLocked?: boolean;
  onToggleItemVisibility?: () => void;
  onLockMenuClicked?: () => void;
}

export const PrefsSidebar = (props: PrefsSidebarProps) => {
  const preferencesMenu = {
    title: 'Preferences',
    items: [
      {
        active: true,
        label: 'General',
        to: '/prefs/general',
        exact: true,
      },
      {
        active: true,
        label: 'Advanced',
        to: '/prefs/advanced',
        exact: true,
      },
    ],
  };

  const applicationSettingsMenu = {
    title: 'Application Settings',
    items: [
      {
        active: true,
        label: 'Storage',
        to: '/prefs/storage',
        exact: true,
      },
    ],
  };

  return <Sidebar {...props} menus={[preferencesMenu, applicationSettingsMenu]} />;
};
