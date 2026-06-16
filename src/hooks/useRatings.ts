/**
 * Custom hook to manage user ratings for recipes, including loading existing ratings and saving new ones.
 */
import { useEffect, useState } from 'react';
import { getCurrentUserRatings, saveRecipeRating } from '../repositories/ratingRepository';

export function useRatings() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadRatings() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        // Ratings are loaded from Supabase for the currently logged-in user.
        const ratingsFromSupabase = await getCurrentUserRatings();
        setRatings(ratingsFromSupabase);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Ratings could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    }

    loadRatings();
  }, []);

  // Saves a new rating for a recipe and updates the local state.
  async function saveRating(recipeId: string, starCount: number) {
    try {
      setErrorMessage('');
      await saveRecipeRating(recipeId, starCount);

      setRatings((currentRatings) => ({
        ...currentRatings,
        [recipeId]: starCount,
      }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Rating could not be saved.');
    }
  }

  // Returns the current user's rating for a specific recipe, or 0 if not rated
  function getRecipeRating(recipeId: string): number {
    return ratings[recipeId] || 0;
  }

  return { saveRating, getRecipeRating, isLoading, errorMessage };
}