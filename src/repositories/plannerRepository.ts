import { supabase } from "../lib/supabaseClient";
import { getCurrentUserId } from "./recipeHelpers";
import { getRecipeById } from "./recipeRepository";
import type { Recipe } from "../models/Recipe";

export interface PlannerEntry {
  dayOfWeek: string;
  recipe: Recipe;
}

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

export async function addRecipeToPlanner(dayOfWeek: string, recipeId: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("weekly_planner")
    .insert({
      user_id: userId,
      day_of_week: dayOfWeek,
      recipe_id: recipeId
    });

  if (error) {
    console.error("Fehler beim Speichern im Planer:", error.message);
    throw new Error(error.message);
  }
}
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