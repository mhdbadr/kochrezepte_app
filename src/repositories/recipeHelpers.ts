/**
 * Helper functions for recipe-related operations, such as retrieving the current user ID and category IDs.
 */

import { supabase } from "../lib/supabaseClient";
import type { Recipe } from "../models/Recipe";

/**
 * Retrieves the ID of the currently logged-in user from Supabase.
 * @returns The ID of the current user.
 * @throws An error if there is a Supabase error or if no user is logged in.
 */
export async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("You must be logged in to create a recipe.");
  }

  return data.user.id;
}

/**
 * Retrieves the ID of the currently logged-in user from Supabase, or returns undefined if no user is logged in.
 * @returns The ID of the current user, or undefined if no user is logged in.
 */
export async function getOptionalCurrentUserId(): Promise<string | undefined> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data.user?.id;
}

/**
 * Retrieves the ID of a recipe category by its name from Supabase.
 * @param categoryName The name of the category to look up.
 * @returns The ID of the category if found.
 * @throws An error if the category does not exist or if there is a Supabase error.
 */
export async function getCategoryId(categoryName: Recipe["category"]): Promise<string> {
  const { data, error } = await supabase
    .from("recipe_categories")
    .select("id")
    .eq("name", categoryName)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(`Category "${categoryName}" does not exist.`);
  }

  return data.id;
}

/**
 * Ensures that the currently logged-in user is the owner of the recipe with the given ID.
 * @param recipeId The ID of the recipe to check ownership for.
 * @param userId The ID of the current user.
 * @throws An error if the recipe does not exist, if there is a Supabase error, or if the user is not the owner of the recipe.
 */
export async function ensureRecipeOwner(recipeId: string, userId: string): Promise<void> {
  const { data, error } = await supabase
    .from("recipes")
    .select("created_by")
    .eq("id", recipeId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Recipe does not exist.");
  }

  if (data.created_by !== userId) {
    throw new Error("You can only edit recipes that you created.");
  }
}