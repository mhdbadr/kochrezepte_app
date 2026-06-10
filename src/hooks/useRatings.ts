import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kochrezepte_ratings';

export function useRatings() {
 
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    const storedRatings = localStorage.getItem(STORAGE_KEY);
    if (storedRatings) {
      setRatings(JSON.parse(storedRatings));
    }
  }, []);

  const saveRating = (recipeId: string, starCount: number) => {
    const newRatings = {
      ...ratings,
      [recipeId]: starCount
    };
    
    setRatings(newRatings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRatings));
  };

  const getRecipeRating = (recipeId: string): number => {
    return ratings[recipeId] || 0; 
  };

  return { saveRating, getRecipeRating };
}