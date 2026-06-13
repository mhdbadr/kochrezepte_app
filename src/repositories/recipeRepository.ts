import type { Recipe } from "../models/Recipe";
import { mockRecipes } from "../data/mockRecipes";
import { supabase } from "../lib/supabaseClient";
import type { SupabaseRecipeRow } from "../models/SupabaseRecipeRow";
import { mapSupabaseRecipeToRecipe } from "../mappers/recipeMapper";

/**
 * Returns all recipes from the Supabase database.
 * If the database query fails, an error is thrown and logged to the console.
 * The recipes are ordered by creation date, with the newest recipes appearing first.
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select(`
      id,
      title,
      description,
      image_url,
      preparation_time,
      created_at,
      created_by,
      recipe_categories (
        name
      ),
      recipe_ingredients (
        name,
        sort_order
      ),
      recipe_steps (
        instruction,
        sort_order
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load recipes from Supabase:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((recipe) => mapSupabaseRecipeToRecipe(recipe as SupabaseRecipeRow));
}

/**
 * Returns a single recipe by its ID.
 */
export function getRecipeById(id: string): Recipe | undefined {
  return mockRecipes.find((recipe) => recipe.id === id);
}

/**
 * Adds a new recipe to the in-memory mock data.
 */
export function createRecipe(recipe: Recipe): void {
  // New recipes are stored in mock data until the database repository is connected.
  mockRecipes.push(recipe);
}

/**
 * Replaces an existing recipe in the in-memory mock data.
 */
export function updateRecipe(recipe: Recipe): void {
  const recipeIndex = mockRecipes.findIndex((existingRecipe) => existingRecipe.id === recipe.id);

  if (recipeIndex !== -1) {
    // Replace only the matching recipe and keep all other recipes unchanged.
    mockRecipes[recipeIndex] = recipe;
  }
}

/**
 * Removes a recipe from the in-memory mock data.
 */
export function deleteRecipe(id: string): void {
  const recipeIndex = mockRecipes.findIndex((recipe) => recipe.id === id);

  if (recipeIndex !== -1) {
    // Remove exactly one recipe from the in-memory list.
    mockRecipes.splice(recipeIndex, 1);
  }
}
