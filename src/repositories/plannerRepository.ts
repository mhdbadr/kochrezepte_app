import { supabase } from "../lib/supabaseClient";
import { getCurrentUserId } from "./recipeHelpers";
import { getRecipeById } from "./recipeRepository";
import type { Recipe } from "../models/Recipe";

/**
 * Represents an entry in the weekly planner, consisting of a day of the week and a recipe.
 */
export interface PlannerEntry {
  dayOfWeek: string;
  recipe: Recipe;
}

/**
 * Fetches all planner entries for the current user from the database.
 * @returns A promise that resolves to an array of PlannerEntry objects.
 */
export async function getPlannerEntries(): Promise<PlannerEntry[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("weekly_planner")
    .select("day_of_week, recipe_id")
    .eq("user_id", userId); 

  if (error) {
    console.error("Fehler beim Laden des Planers:", error.message);
    throw new Error(error.message);
  }

  const entries: PlannerEntry[] = [];
    for (const row of (data ?? [])) {
    const recipe = await getRecipeById(row.recipe_id);
    if (recipe) {
      entries.push({
        dayOfWeek: row.day_of_week,
        recipe: recipe
      });
    }
  }

  return entries;
}

/**
 * Adds a recipe to the weekly planner for a specific day of the week.
 * @param dayOfWeek - The day of the week to which the recipe should be added.
 * @param recipeId - The ID of the recipe to be added to the planner.
 */
export async function addRecipeToPlanner(dayOfWeek: string, recipeId: string): Promise<void> {
  const userId = await getCurrentUserId();

  // Check if the recipe is already planned for the specified day
  const { data: existingEntry, error: existingEntryError } = await supabase
    .from("weekly_planner")
    .select("id")
    .eq("user_id", userId)
    .eq("day_of_week", dayOfWeek)
    .eq("recipe_id", recipeId)
    .maybeSingle();

  // If there was an error while checking for existing entries, log it and throw an error
  if (existingEntryError) {
    console.error("Fehler beim Pruefen des Planers:", existingEntryError.message);
    throw new Error(existingEntryError.message);
  }

  // If an existing entry is found, throw an error indicating that the recipe is already planned for the specified day
  if (existingEntry) {
    throw new Error(`Dieses Rezept ist fuer ${dayOfWeek} bereits eingeplant.`);
  }

  // Insert the new planner entry into the database
  const { error } = await supabase
    .from("weekly_planner")
    .insert({
      user_id: userId,
      day_of_week: dayOfWeek,
      recipe_id: recipeId
    });

  if (error) {
    // If the error code is "23505", it indicates a unique constraint violation,
    // meaning the recipe is already planned for that day.
    if (error.code === "23505") {
      throw new Error(`Dieses Rezept ist fuer ${dayOfWeek} bereits eingeplant.`);
    }

    console.error("Fehler beim Speichern im Planer:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Removes a recipe from the weekly planner for a specific day of the week.
 */
export async function removeRecipeFromPlanner(dayOfWeek: string, recipeId: string): Promise<void> {
  const { error } = await supabase
    .from("weekly_planner")
    .delete()
    .eq("day_of_week", dayOfWeek)
    .eq("recipe_id", recipeId); 

  if (error) {
    console.error("Fehler beim Löschen aus dem Planer:", error.message);
    throw new Error(error.message);
  }
}