/**
 * This module provides a mapping function to convert Supabase recipe rows into the Recipe model used by the UI
 */
import type { Recipe } from "../models/Recipe";
import type { RecipeCategory } from "../models/RecipeCategory";
import type { SupabaseRecipeRow } from "../models/SupabaseRecipeRow";

// Fallback category used when the Supabase category is missing or invalid.
const fallbackCategory: RecipeCategory = "Quick";

// Extracts the category name from the Supabase recipe row.
function getCategoryName(category: SupabaseRecipeRow["recipe_categories"]): string | undefined {
  if (Array.isArray(category)) {
    return category[0]?.name;
  }

  return category?.name;
}

// Converts a Supabase category string into the app's RecipeCategory type.
function toRecipeCategory(categoryName: string | undefined): RecipeCategory {
  const allowedCategories: RecipeCategory[] = [
    "Vegan",
    "Vegetarian",
    "Dessert",
    "Quick",
    "Pasta",
    "Main Dish",
    "Healthy",
  ];

  return allowedCategories.includes(categoryName as RecipeCategory)
    ? (categoryName as RecipeCategory)
    : fallbackCategory;
}

// Converts the normalized Supabase rows into the Recipe model used by the UI.
export function mapSupabaseRecipeToRecipe(recipe: SupabaseRecipeRow): Recipe {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    category: toRecipeCategory(getCategoryName(recipe.recipe_categories)),
    imageUrl: recipe.image_url ?? undefined,
    preparationTime: recipe.preparation_time,
    ingredients: [...recipe.recipe_ingredients]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((ingredient) => ({
        amount: ingredient.amount, 
        unit: ingredient.unit,     
        name: ingredient.name,     
      })),
    instructions: [...recipe.recipe_steps]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((step) => step.instruction),
    createdAt: recipe.created_at ?? undefined,
    createdBy: recipe.created_by ?? undefined,
    isEditable: false,
  };
}
