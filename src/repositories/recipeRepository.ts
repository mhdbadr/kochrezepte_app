import type { Recipe } from "../models/Recipe";
import { mockRecipes } from "../data/mockRecipes";
import { supabase } from "../lib/supabaseClient";
import type { SupabaseRecipeRow } from "../models/SupabaseRecipeRow";
import { mapSupabaseRecipeToRecipe } from "../mappers/recipeMapper";
import { recipeSelectQuery } from "./recipeQueries";
import { getCurrentUserId, getCategoryId } from "./recipeHelpers";

/**
 * Returns all recipes from the Supabase database.
 * If the database query fails, an error is thrown and logged to the console.
 * The recipes are ordered by creation date, with the newest recipes appearing first.
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select(recipeSelectQuery)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load recipes from Supabase:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((recipe) => mapSupabaseRecipeToRecipe(recipe as SupabaseRecipeRow));
}

/**
 * Returns a single recipe matching the provided ID from the Supabase database.
 * If the database query fails, an error is thrown and logged to the console.
 * If no recipe with the given ID is found, undefined is returned.
 */
export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const { data, error } = await supabase
    .from("recipes")
    .select(recipeSelectQuery)
    .eq("id", id)
    .maybeSingle(); // returns null if no match is found, instead of throwing an error.

  if (error) {
    console.error("Failed to load recipe from Supabase:", error.message);
    throw new Error(error.message);
  }

  return data ? mapSupabaseRecipeToRecipe(data as SupabaseRecipeRow) : undefined;
}

/**
 * Creates a new recipe in Supabase for the currently logged-in user.
 */
export async function createRecipe(recipe: Recipe): Promise<Recipe> {
  const userId = await getCurrentUserId();
  const categoryId = await getCategoryId(recipe.category);

  const { data: insertedRecipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({
      title: recipe.title,
      description: recipe.description,
      category_id: categoryId,
      image_url: recipe.imageUrl ?? null,
      preparation_time: recipe.preparationTime,
      created_by: userId,
    })
    .select("id")
    .single();

  if (recipeError) {
    console.error("Failed to create recipe in Supabase:", recipeError.message);
    throw new Error(recipeError.message);
  }

  const recipeId = insertedRecipe.id;

  const ingredientRows = recipe.ingredients.map((ingredient, index) => ({
    recipe_id: recipeId,
    name: ingredient,
    sort_order: index + 1,
  }));

  const stepRows = recipe.instructions.map((instruction, index) => ({
    recipe_id: recipeId,
    instruction,
    sort_order: index + 1,
  }));

  const { error: ingredientsError } = await supabase
    .from("recipe_ingredients")
    .insert(ingredientRows);

  if (ingredientsError) {
    await supabase.from("recipes").delete().eq("id", recipeId);
    console.error("Failed to create recipe ingredients in Supabase:", ingredientsError.message);
    throw new Error(ingredientsError.message);
  }

  const { error: stepsError } = await supabase
    .from("recipe_steps")
    .insert(stepRows);

  if (stepsError) {
    await supabase.from("recipes").delete().eq("id", recipeId);
    console.error("Failed to create recipe steps in Supabase:", stepsError.message);
    throw new Error(stepsError.message);
  }

  const createdRecipe = await getRecipeById(recipeId);

  if (!createdRecipe) {
    throw new Error("Recipe was created but could not be loaded.");
  }

  return createdRecipe;
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
