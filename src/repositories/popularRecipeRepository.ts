import type { Recipe } from '../models/Recipe';
import { supabase } from '../lib/supabaseClient';
import { getAllRecipes } from './recipeRepository';

/**
 * Returns the start date for the given popularity period.
 */
export type PopularityPeriod = 'week' | 'month' | 'year' | 'all';

/**
 * Represents a popular recipe result with its associated data.
 */
export interface PopularRecipeResult {
  recipe: Recipe;
  averageRating: number;
  ratingCount: number;
}

/**
 * Represents a row in the ratings table.
 */
interface RatingRow {
  recipe_id: string;
  rating: number;
  created_at: string;
}

/**
 * Returns the start date for the given popularity period.
 * @param period - The popularity period ('week', 'month', 'year', or 'all').
 * @returns The start date as an string, or undefined if the period is 'all'
 */
function getPeriodStart(period: PopularityPeriod): string | undefined {
  if (period === 'all') return undefined;

  // Define the number of days for each period
  const daysByPeriod: Record<Exclude<PopularityPeriod, 'all'>, number> = {
    week: 7,
    month: 30,
    year: 365,
  };
  const start = new Date();
  // get the start date by subtracting the number of days for the selected period
  start.setDate(start.getDate() - daysByPeriod[period]);
  return start.toISOString();
}

/**
 * Loads recipes ranked by rating quality and count.
 */
export async function getPopularRecipes(
  period: PopularityPeriod,
  limit = 12,
): Promise<PopularRecipeResult[] | null> {
    // Create a query to fetch ratings from the database
  let ratingsQuery = supabase
    .from('ratings')
    .select('recipe_id, rating, created_at');
  const periodStart = getPeriodStart(period);

  if (periodStart) {
      // Filter ratings by the start date of the selected period
    ratingsQuery = ratingsQuery.gte('created_at', periodStart);
  }

  const recipes = await getAllRecipes();
  // Execute the ratings query
  const ratingsResponse = await ratingsQuery;

  if (ratingsResponse.error) {
    console.error('Beliebte Rezepte konnten nicht geladen werden:', ratingsResponse.error.message);
    return null;
  }

  const ratings = (ratingsResponse.data ?? []) as RatingRow[];

  // Create an array to hold the results
  const results: PopularRecipeResult[] = [];

  for (const recipe of recipes) {
      // Filter the ratings for the current recipe
    const recipeRatings = ratings.filter((row) => row.recipe_id === recipe.id);

    // If there are no ratings for this recipe, skip it
    if (recipeRatings.length === 0) continue;

    // Calculate the sum of ratings for this recipe
    const ratingSum = recipeRatings.reduce((sum, row) => sum + Number(row.rating), 0);

    results.push({
      recipe,
      ratingCount: recipeRatings.length,
      averageRating: ratingSum / recipeRatings.length,
    });
  }

  // Popularity points = average rating multiplied by rating count.
  results.sort((first, second) => {
    const firstScore = first.averageRating * first.ratingCount;
    const secondScore = second.averageRating * second.ratingCount;

    // Sort by popularity points first, then by average rating if the points are equal
    if (firstScore !== secondScore) return secondScore - firstScore;
    return second.averageRating - first.averageRating;
  });

  return results.slice(0, limit);
}
