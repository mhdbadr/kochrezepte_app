import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kochrezepte_favorites';

export function useFavorites() {
  
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem(STORAGE_KEY);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const updateFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
  };

  const toggleFavorite = (recipeId: string) => {
    if (favorites.includes(recipeId)) {
   
      updateFavorites(favorites.filter(id => id !== recipeId));
    } else {
    
      updateFavorites([...favorites, recipeId]);
    }
  };

  const isFavorite = (recipeId: string) => {
    return favorites.includes(recipeId);
  };

  return { favorites, toggleFavorite, isFavorite };
}