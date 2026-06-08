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
 * Placeholder for future recipe creation.
 */
export function createRecipe(recipe: Recipe): void {
  console.log("Create recipe:", recipe);
}

/**
 * Placeholder for future recipe update.
 */
export function updateRecipe(recipe: Recipe): void {
  console.log("Update recipe:", recipe);
}

/**
 * Placeholder for future recipe deletion.
 */
export function deleteRecipe(id: string): void {
  console.log("Delete recipe:", id);
}