import type { Recipe } from "../models/Recipe";
import type { ShoppingListItem } from "../models/ShoppingListItem";

/**
 * Represents a planned recipe for a specific day of the week
 */
interface PlannedRecipe {
  dayOfWeek: string;
  recipe: Recipe;
}

/**
 * Represents a section of the shopping list to a specific planned recipe
 */
export interface ShoppingListRecipeSection {
  key: string; // Unique key for the section
  recipeTitle: string;
  dayOfWeek: string;
  items: ShoppingListItem[];
}

/**
 * Builds shopping list sections for each planned recipe, including the day of the week and the recipe title.
 * @param plannedRecipes An array of planned recipes, each associated with a specific day of the week
 * @returns An array of shopping list recipe sections, each containing the recipe title, day of the week, and the shopping list items
 */
export function buildShoppingListSections(plannedRecipes: PlannedRecipe[]): ShoppingListRecipeSection[] {
  return plannedRecipes.map((entry) => ({
    key: `${entry.dayOfWeek}_${entry.recipe.id}`,
    recipeTitle: entry.recipe.title,
    dayOfWeek: entry.dayOfWeek,
    items: entry.recipe.ingredients.map((ingredient, index) => {
      const name = ingredient.name.trim();
      const unit = ingredient.unit?.trim() || null;

      return {
        key: `${entry.dayOfWeek}_${entry.recipe.id}_${index}_${name.toLowerCase()}_${(unit ?? '').toLowerCase()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        amount: ingredient.amount ?? 0,
        unit,
        recipeTitle: entry.recipe.title,
        dayOfWeek: entry.dayOfWeek,
        isChecked: false,
      };
    }),
  }));
}
