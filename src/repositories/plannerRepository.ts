import { supabase } from "../lib/supabaseClient";
import { getCurrentUserId } from "./recipeHelpers";
import type { Recipe } from "../models/Recipe";

export interface PlannerEntry {
  dayOfWeek: string;
  recipe: Recipe;
}

/**
 * Fetches all weekly planner entries for the current user including recipes and ingredients.
 * Uses a single SQL JOIN query via Supabase to prevent the N+1 query problem and maximize performance.
 * * @returns A promise resolving to an array of formatted PlannerEntry objects.
 */
export async function getPlannerEntries(): Promise<PlannerEntry[]> {
  const userId = await getCurrentUserId();

  // Fetch planner entries, nested recipes, and recipe ingredients in a single network request
  const { data, error } = await supabase
    .from("weekly_planner")
    .select(`
      day_of_week,
      recipe_id,
      recipes!weekly_planner_recipe_id_fkey (
        id,
        title,
        description,
        image_url,
        preparation_time,
        difficulty,
        servings,
        rating,
        recipe_ingredients (
          id,
          recipe_id,
          name,
          amount,
          unit
        )
      )
    `)
    .eq("user_id", userId); 

  if (error) {
    console.error("Error loading planner entries:", error.message);
    throw new Error(error.message);
  }

  const entries: PlannerEntry[] = [];
  
  // Map the nested database relation types safely into the frontend interface structure
  (data ?? []).forEach((row: any) => {
    const rawRecipe = Array.isArray(row.recipes) ? row.recipes[0] : row.recipes;

    if (rawRecipe) {
      // Map database ingredient rows into the RecipeIngredient interface structure
      const formattedIngredients = (rawRecipe.recipe_ingredients || []).map((ing: any) => ({
        id: ing.id,
        recipe_id: ing.recipe_id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit
      }));

      entries.push({
        dayOfWeek: row.day_of_week,
        recipe: {
          id: rawRecipe.id,
          title: rawRecipe.title,
          description: rawRecipe.description,
          instructions: rawRecipe.instructions || [],
          category: rawRecipe.recipe_categories || { id: '', name: rawRecipe.category || '' },
          imageUrl: rawRecipe.image_url ?? undefined,
          preparationTime: rawRecipe.preparation_time,
          rating: rawRecipe.rating ? Number(rawRecipe.rating) : undefined,
          ingredients: formattedIngredients 
        }
      });
    }
  });

  return entries;
}

/**
 * Inserts a new recipe assignment for a specific day of the week into the database.
 * * @param dayOfWeek The target weekday string (e.g., 'Montag')
 * @param recipeId The unique identifier of the recipe to assign
 */
export async function addRecipeToPlanner(dayOfWeek: string, recipeId: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("weekly_planner")
    .insert({
      user_id: userId,
      day_of_week: dayOfWeek,
      recipe_id: recipeId
    });

  if (error) {
    console.error("Error saving to planner:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Removes a specific recipe entry from a weekday in the planner database.
 * * @param dayOfWeek The weekday string from which the recipe should be removed
 * @param recipeId The unique identifier of the recipe to unassign
 */
export async function removeRecipeFromPlanner(dayOfWeek: string, recipeId: string): Promise<void> {
  const { error } = await supabase
    .from("weekly_planner")
    .delete()
    .eq("day_of_week", dayOfWeek)
    .eq("recipe_id", recipeId); 

  if (error) {
    console.error("Error deleting from planner:", error.message);
    throw new Error(error.message);
  }
}