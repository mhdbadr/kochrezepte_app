import type { Recipe } from "../models/Recipe";
import type { ShoppingListItem } from "../models/ShoppingListItem";

/**
 * Builds a shopping list from the given planned recipes, optionally grouping identical ingredients together
 */
interface BuildShoppingListOptions {
  groupShoppingListItems: boolean;
}

/**
 * Generates a shopping list based on the provided planned recipes and options.
 * @param plannedRecipes An array of recipes that are planned for the week
 * @param options Configuration options for building the shopping list
 * @returns An array of shopping list items generated from the planned recipes according to the specified options
 */
export function buildShoppingList(
  plannedRecipes: Recipe[],
  options: BuildShoppingListOptions = { groupShoppingListItems: true },
): ShoppingListItem[] {
  if (!options.groupShoppingListItems) {
    return plannedRecipes.flatMap((recipe) =>
      recipe.ingredients.map((ingredient, index) => {
        const name = ingredient.name.trim();
        const unit = ingredient.unit?.trim() || null;

        return {
          key: `${recipe.id}_${index}_${name.toLowerCase()}_${(unit ?? '').toLowerCase()}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          amount: ingredient.amount ?? 0,
          unit,
          recipeTitle: recipe.title,
          isChecked: false,
        };
      }),
    );
  }

  const combinedIngredients: { [key: string]: { amount: number; unit: string | null } } = {};

  plannedRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const key = `${ingredient.name.toLowerCase().trim()}_${(ingredient.unit ?? '').toLowerCase().trim()}`;
      const amount = ingredient.amount ?? 0;

      if (combinedIngredients[key]) {
        combinedIngredients[key].amount += amount;
      } else {
        combinedIngredients[key] = {
          amount: amount,
          unit: ingredient.unit,
        };
      }
    });
  });

  return Object.keys(combinedIngredients).map((key) => {
    const nameWithoutKey = key.split('_')[0];
    const formattedName = nameWithoutKey.charAt(0).toUpperCase() + nameWithoutKey.slice(1);

    return {
      key,
      name: formattedName,
      amount: combinedIngredients[key].amount,
      unit: combinedIngredients[key].unit,
      isChecked: false,
    };
  });
}
