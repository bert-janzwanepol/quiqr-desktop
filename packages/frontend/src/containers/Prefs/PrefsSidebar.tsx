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
      {
        active: true,
        label: 'Git',
        to: '/prefs/git',
        exact: true,
      },
      {
        active: true,
        label: 'Logging',
        to: '/prefs/logging',
        exact: true,
      },
    ],
  };

  return <Sidebar {...props} menus={[preferencesMenu, applicationSettingsMenu]} />;
};
