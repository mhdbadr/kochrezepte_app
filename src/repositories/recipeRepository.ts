import type { Recipe } from "../models/Recipe";
import { mockRecipes } from "../data/mockRecipes";

/**
 * Returns all available recipes.
 */
export function getAllRecipes(): Recipe[] {
  return mockRecipes;
}

/**
 * Returns a single recipe by its ID.
 */
export function getRecipeById(id: string): Recipe | undefined {
  return mockRecipes.find((recipe) => recipe.id === id);
}

/**
 * Adds a new recipe to the in-memory mock data.
 */
export function createRecipe(recipe: Recipe): void {
  // New recipes are stored in mock data until the database repository is connected.
  mockRecipes.push(recipe);
}

/**
 * Replaces an existing recipe in the in-memory mock data.
 */
export function updateRecipe(recipe: Recipe): void {
  const recipeIndex = mockRecipes.findIndex((existingRecipe) => existingRecipe.id === recipe.id);

  if (recipeIndex !== -1) {
    // Replace only the matching recipe and keep all other recipes unchanged.
    mockRecipes[recipeIndex] = recipe;
  }
}

/**
 * Removes a recipe from the in-memory mock data.
 */
export function deleteRecipe(id: string): void {
  const recipeIndex = mockRecipes.findIndex((recipe) => recipe.id === id);

  if (recipeIndex !== -1) {
    // Remove exactly one recipe from the in-memory list.
    mockRecipes.splice(recipeIndex, 1);
  }
}
