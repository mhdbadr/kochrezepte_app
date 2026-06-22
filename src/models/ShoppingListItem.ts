/**
 * Represents an item in the shopping list
 */
export interface ShoppingListItem {
  key: string;
  name: string;
  amount: number;
  unit: string | null;
  recipeTitle?: string;
  isChecked: boolean; 
}