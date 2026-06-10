import type { RecipeCategory } from "./RecipeCategory";

/**
 * Recipe model representing the structure of a recipe in the application.
 */
export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: RecipeCategory;
  imageUrl?: string;
  preparationTime: number;
  rating?: number;
  createdAt?: string;
}