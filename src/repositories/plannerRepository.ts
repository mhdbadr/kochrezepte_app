import { supabase } from "../lib/supabaseClient";
import { getOptionalCurrentUserId } from "./recipeHelpers";
import { getRecipeById } from "./recipeRepository";
import type { Recipe } from "../models/Recipe";

export async function getPlannerEntries(): Promise<PlannerEntry[]> {
  const currentUserId = await getOptionalCurrentUserId();

  // Wenn ein User eingeloggt ist, filtern wir nach ihm.
  // Wenn nicht, holen wir einfach alle Einträge ohne User-Zuordnung (wichtig fürs Testen!)
  let query = supabase.from("weekly_planner").select("day_of_week, recipe_id");
  
  if (currentUserId) {
    query = query.eq("user_id", currentUserId);
  } else {
    query = query.is("user_id", null);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Fehler beim Laden des Planers:", error.message);
    throw new Error(error.message);
  }

  const entries: PlannerEntry[] = [];
  for (const row of (data ?? [])) {
    const recipe = await getRecipeById(row.recipe_id);
    if (recipe) {
      entries.push({ dayOfWeek: row.day_of_week, recipe: recipe });
    }
  }
  return entries;
}

export async function addRecipeToPlanner(dayOfWeek: string, recipeId: string): Promise<void> {
  const currentUserId = await getOptionalCurrentUserId();

  // JETZT GEFIXT: Wenn kein User eingeloggt ist, übergeben wir einfach undefined.
  // Supabase trägt dann automatisch NULL in die Spalte ein und meckert nicht mehr wegen des Foreign Keys!
  const { error } = await supabase
    .from("weekly_planner")
    .insert({
      user_id: currentUserId || undefined, 
      day_of_week: dayOfWeek,
      recipe_id: recipeId
    });

  if (error) {
    console.error("Fehler beim Speichern im Planer:", error.message);
    throw new Error(error.message);
  }
}