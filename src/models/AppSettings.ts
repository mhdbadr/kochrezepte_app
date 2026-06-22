/**
 * Defines the possible sorting modes for the shopping list
 */
export type ShoppingListSortMode = 'alphabetical' | 'recipe';

/**
 * Defines the possible theme modes for the application
 */
export type ThemeMode = 'system' | 'light' | 'dark';


/**
 * Represents the application settings that can be customized by the user
 */
export interface AppSettings {
    shoppingListSortMode: ShoppingListSortMode;
    moveCheckedItemsDown: boolean;
    saveCheckedItems: boolean;
    groupShoppingListItems: boolean;
    themeMode: ThemeMode;
}