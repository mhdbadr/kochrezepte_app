/**
 * Defines the possible theme modes for the application
 */
export type ThemeMode = 'system' | 'light' | 'dark';


/**
 * Represents the application settings that can be customized by the user
 */
export interface AppSettings {
    moveCheckedItemsDown: boolean;
    saveCheckedItems: boolean;
    themeMode: ThemeMode;
}
