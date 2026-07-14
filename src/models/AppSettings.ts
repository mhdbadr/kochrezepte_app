/**
 * Defines the possible theme modes for the application
 */
export type ThemeMode = 'system' | 'light' | 'dark';

/**
 * Defines the possible dietary preferences for the application
 */
export type DietaryPreference = 'all' | 'Vegan' | 'Vegetarisch' | 'Pescetarisch';


/**
 * Represents the application settings that can be customized by the user
 */
export interface AppSettings {
    moveCheckedItemsDown: boolean;
    saveCheckedItems: boolean;
    themeMode: ThemeMode;
    dietaryPreference: DietaryPreference; // The user's dietary preference
}
