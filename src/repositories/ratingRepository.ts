/**
 * Repository for managing user ratings of recipes.
 */

import { supabase } from '../lib/supabaseClient';
import { getCurrentUserId, getOptionalCurrentUserId } from './recipeHelpers';

/** Loads the current user's ratings as a map: recipe ID -> rating value. */
export async function getCurrentUserRatings(): Promise<Record<string, number>> {
  const userId = await getOptionalCurrentUserId();

  if (!userId) return {}; // No user logged in, so no ratings.

  const { data, error } = await supabase
    .from('ratings')
    .select('recipe_id, rating')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  // Convert the array of ratings into a map for easy lookup by recipe ID.
  return data.reduce<Record<string, number>>((ratingsByRecipeId, ratingRow) => {
    ratingsByRecipeId[ratingRow.recipe_id] = ratingRow.rating;
    return ratingsByRecipeId;
  }, {});
}

/** Creates or updates the current user's rating for one recipe. */
export async function saveRecipeRating(recipeId: string, rating: number): Promise<void> {
  const userId = await getCurrentUserId();

  if (rating < 1) {
    const { error } = await supabase
      .from('ratings')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  const { error } = await supabase
    .from('ratings')
    .upsert(
      { user_id: userId, recipe_id: recipeId, rating },
      { onConflict: 'user_id,recipe_id' }
    );

  if (error) {
    throw new Error(error.message);
  }
}
