import type { Recipe } from "../models/Recipe";
import { mockRecipes } from "../data/mockRecipes";
import { supabase } from "../lib/supabaseClient";
import type { SupabaseRecipeRow } from "../models/SupabaseRecipeRow";
import { mapSupabaseRecipeToRecipe } from "../mappers/recipeMapper";
import { recipeSelectQuery } from "./recipeQueries";
import { getCurrentUserId, getOptionalCurrentUserId, getCategoryId, ensureRecipeOwner } from "./recipeHelpers";



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

  if (!data) {
    return undefined;
  }

  const recipe = mapSupabaseRecipeToRecipe(data as SupabaseRecipeRow);
  const currentUserId = await getOptionalCurrentUserId();

  return {
    ...recipe,
    isEditable: Boolean(recipe.createdBy && recipe.createdBy === currentUserId),
  };
}

/**
 * Creates a new recipe in the Supabase database.
 * Only logged-in users are allowed to create recipes.
 * If the database query fails, an error is thrown and logged to the console.
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
 * Updates an existing recipe in Supabase.
 * Only the user who created the recipe is allowed to update it.
 */
export async function updateRecipe(recipe: Recipe): Promise<Recipe> {
  const userId = await getCurrentUserId();
  await ensureRecipeOwner(recipe.id, userId);

  const categoryId = await getCategoryId(recipe.category);

  // Update the main recipe details in the "recipes" table.
  const { error: recipeError } = await supabase
    .from("recipes")
    .update({
      title: recipe.title,
      description: recipe.description,
      category_id: categoryId,
      image_url: recipe.imageUrl ?? null,
      preparation_time: recipe.preparationTime,
    })
    .eq("id", recipe.id)
    .eq("created_by", userId);

  if (recipeError) {
    console.error("Failed to update recipe in Supabase:", recipeError.message);
    throw new Error(recipeError.message);
  }

  // Replace the recipe's ingredients by first deleting existing ones and then inserting the updated list.
  const { error: deleteIngredientsError } = await supabase
    .from("recipe_ingredients")
    .delete()
    .eq("recipe_id", recipe.id);

  if (deleteIngredientsError) {
    console.error("Failed to replace recipe ingredients:", deleteIngredientsError.message);
    throw new Error(deleteIngredientsError.message);
  }

  // Prepare the new ingredient rows with the correct recipe ID and sort order.
  const ingredientRows = recipe.ingredients.map((ingredient, index) => ({
    recipe_id: recipe.id,
    name: ingredient,
    sort_order: index + 1,
  }));

  const { error: insertIngredientsError } = await supabase
    .from("recipe_ingredients")
    .insert(ingredientRows);

  if (insertIngredientsError) {
    console.error("Failed to insert updated recipe ingredients:", insertIngredientsError.message);
    throw new Error(insertIngredientsError.message);
  }

  const { error: deleteStepsError } = await supabase
    .from("recipe_steps")
    .delete()
    .eq("recipe_id", recipe.id);

  if (deleteStepsError) {
    console.error("Failed to replace recipe steps:", deleteStepsError.message);
    throw new Error(deleteStepsError.message);
  }

  const stepRows = recipe.instructions.map((instruction, index) => ({
    recipe_id: recipe.id,
    instruction,
    sort_order: index + 1,
  }));

  const { error: insertStepsError } = await supabase
    .from("recipe_steps")
    .insert(stepRows);

  if (insertStepsError) {
    console.error("Failed to insert updated recipe steps:", insertStepsError.message);
    throw new Error(insertStepsError.message);
  }

  // After updating the recipe and its related ingredients and steps, fetch the updated recipe to return it.
  const updatedRecipe = await getRecipeById(recipe.id);

  if (!updatedRecipe) {
    throw new Error("Recipe was updated but could not be loaded.");
  }

  return updatedRecipe;
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
