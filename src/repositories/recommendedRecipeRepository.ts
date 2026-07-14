import type { DietaryPreference } from '../models/AppSettings';
import type { Recipe } from '../models/Recipe';
import { getOptionalCurrentUserId } from './recipeHelpers';
import { getAllRecipes } from './recipeRepository';

/**
 * Checks if a recipe matches the given dietary preference.
 * @param recipe
 * @param preference
 */
function matchesPreference(recipe: Recipe, preference: DietaryPreference): boolean {
  if (preference === 'all') return true;
  if (preference === 'Vegetarisch') {
    return recipe.category === 'Vegetarisch' || recipe.category === 'Vegan';
  }

  if (preference === 'Pescetarisch') {
    return (
      recipe.category === 'Pescetarisch' ||
      recipe.category === 'Vegetarisch' ||
      recipe.category === 'Vegan'
    );
  }

  return recipe.category === 'Vegan';
}

/**
 * Returns the newest matching public recipes and excludes recipes owned by the current user.
 * getAllRecipes already sorts the result from newest to oldest.
 */
export async function getNewestRecommendedRecipes(
  preference: DietaryPreference,
  limit = 12,
): Promise<Recipe[] | null> {
  try {
    const [recipes, currentUserId] = await Promise.all([
      getAllRecipes(),
      getOptionalCurrentUserId(),
    ]);

    // Filter recipes based on the current user's ID and preference, then limit the results.
    return recipes
        // Exclude recipes owned by the current user
      .filter((recipe) => !currentUserId || recipe.createdBy !== currentUserId)
        // Filter by dietary preference
      .filter((recipe) => matchesPreference(recipe, preference))
      .slice(0, limit);
  } catch (error) {
    console.error('Persönliche Rezeptvorschläge konnten nicht geladen werden:', error);
    return null;
  }
}
