import type { RecipeCategory } from "./RecipeCategory";

/**
 * RecipeDifficulty type representing the difficulty levels of a recipe
 */
export type RecipeDifficulty = "Einfach" | "Mittel" | "Schwer";

/**
 * RecipeIngredient model representing the structure of an ingredient in a recipe
 */
export interface RecipeIngredient {
  id?: string;          
  recipe_id?: string;   
  amount: number | null; 
  unit: string | null;   
  name: string;          
}

/**
 * Recipe model representing the structure of a recipe in the application.
 */
export interface Recipe {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  category: RecipeCategory;
  difficulty: RecipeDifficulty;
  imageUrl?: string;
  preparationTime: number;
  servings: number; // Number of servings the recipe yields
  rating?: number;
  createdAt?: string;
  createdBy?: string; // User ID of the recipe creator, used for permission checks.
  isEditable?: boolean; // Indicates whether the current user can edit this recipe, based on ownership.
  ingredients: RecipeIngredient[];
}
