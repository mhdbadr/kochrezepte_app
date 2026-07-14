/**
 * Custom hook to manage favorite recipes, including loading, toggling, and error handling.
 */

import { useEffect, useState } from 'react';
import {
  addFavoriteRecipe,
  getFavoriteRecipeIds,
  removeFavoriteRecipe,
} from '../repositories/favoriteRepository';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadFavorites() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        // Favorite IDs are loaded from Supabase instead of localStorage.
        const favoriteIds = await getFavoriteRecipeIds();
        setFavorites(favoriteIds);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Favorites could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadFavorites();
  }, []);

  // Toggles a recipe's favorite status and updates both Supabase and local state.
  async function toggleFavorite(recipeId: string) {
    try {
      setErrorMessage('');

      if (favorites.includes(recipeId)) {
        await removeFavoriteRecipe(recipeId);
        setFavorites((currentFavorites) => currentFavorites.filter((id) => id !== recipeId));
        return;
      }

      await addFavoriteRecipe(recipeId);
      setFavorites((currentFavorites) => [...currentFavorites, recipeId]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Favorite could not be changed.');
    }
  }

  // check if a recipe is in the user's favorites
  function isFavorite(recipeId: string) {
    return favorites.includes(recipeId);
  }

  return { favorites, toggleFavorite, isFavorite, isLoading, errorMessage };
}