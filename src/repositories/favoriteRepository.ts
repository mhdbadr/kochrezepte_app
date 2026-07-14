/**
 * Repository for managing favorite recipes in Supabase.
 * This includes loading, adding, and removing favorite recipes for the current user.
 */

import { supabase } from '../lib/supabaseClient';
import { getCurrentUserId, getOptionalCurrentUserId } from './recipeHelpers';

/** Loads the favorite recipe IDs for the currently logged-in user. */
export async function getFavoriteRecipeIds(): Promise<string[]> {
  const userId = await getOptionalCurrentUserId();

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('favorites')
    .select('recipe_id')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((favorite) => favorite.recipe_id);
}

/** Adds a recipe to the current user's favorites in Supabase. */
export async function addFavoriteRecipe(recipeId: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, recipe_id: recipeId });

  if (error) {
    throw new Error(error.message);
  }
}

/** Removes a recipe from the current user's favorites in Supabase. */
export async function removeFavoriteRecipe(recipeId: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('recipe_id', recipeId);

  if (error) {
    throw new Error(error.message);
  }
}
