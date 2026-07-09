import { AppSettings, ThemeMode } from '../models/AppSettings';

const SETTINGS_STORAGE_KEY = 'bitebook_settings';

/**
 * Default application settings used when no user-defined settings are found in localStorage
 */
export const defaultAppSettings: AppSettings = {
  moveCheckedItemsDown: true,
  saveCheckedItems: true,
  themeMode: 'system',
};

/**
 * Loads the application settings from localStorage.
 * If no settings are found or if parsing fails, returns the default settings.
 * @returns {AppSettings} The loaded application settings or default settings if none are found
 */
export function loadAppSettings(): AppSettings {
  const rawSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!rawSettings) {
    return defaultAppSettings;
  }

  try {
    return {
      ...defaultAppSettings,
      ...JSON.parse(rawSettings),
    };
  } catch {
    return defaultAppSettings;
  }
}

/**
 * Saves the given application settings to localStorage
 * @param settings The application settings to be saved
 */
export function saveAppSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

/**
 * Applies the selected theme mode to the application by setting a data attribute on the document element
 * @param themeMode The theme mode to be applied (system, light, or dark)
 */
export function applyTheme(themeMode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDarkTheme = themeMode === 'dark' || (themeMode === 'system' && prefersDark);

  document.documentElement.dataset.theme = shouldUseDarkTheme ? 'dark' : 'light';
}
