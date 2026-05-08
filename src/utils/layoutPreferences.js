const DESKTOP_SIDEBAR_COLLAPSED_KEY = 'desktopSidebarCollapsed';

const getBooleanPreference = (key, fallback = false) => {
  const value = localStorage.getItem(key);

  if (value === null) return fallback;

  return value === 'true';
};

export const layoutPreferences = {
  getDesktopSidebarCollapsed: () =>
    getBooleanPreference(DESKTOP_SIDEBAR_COLLAPSED_KEY),

  setDesktopSidebarCollapsed: (isCollapsed) => {
    localStorage.setItem(
      DESKTOP_SIDEBAR_COLLAPSED_KEY,
      String(isCollapsed)
    );
  },
};
