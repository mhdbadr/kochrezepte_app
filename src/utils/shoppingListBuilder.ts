import type { Recipe } from "../models/Recipe";
import type { ShoppingListItem } from "../models/ShoppingListItem";

export function buildShoppingList(plannedRecipes: Recipe[]): ShoppingListItem[] {
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
      name: formattedName,
      amount: combinedIngredients[key].amount,
      unit: combinedIngredients[key].unit,
      isChecked: false,
    };
  });
}