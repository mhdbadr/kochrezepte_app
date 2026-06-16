/**
 * Repository for managing recipe comments in Supabase
 */
import { supabase } from '../lib/supabaseClient';
import { getCurrentUserId } from './recipeHelpers';

export interface RecipeComment {
  id: string;
  recipeId: string;
  userId: string;
  text: string;
  createdAt: string;
}

interface SupabaseCommentRow {
  id: string;
  recipe_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

// Maps a Supabase comment row to the RecipeComment type used in the app.
function mapComment(row: SupabaseCommentRow): RecipeComment {
  return {
    id: row.id,
    recipeId: row.recipe_id,
    userId: row.user_id,
    text: row.content,
    createdAt: new Date(row.created_at).toLocaleDateString('de-DE'),
  };
}

/** Loads all comments for one recipe from Supabase. */
export async function getCommentsByRecipeId(recipeId: string): Promise<RecipeComment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('id, recipe_id, user_id, content, created_at')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data.map(mapComment);
}

/** Creates a comment for the currently logged-in user. */
export async function createComment(recipeId: string, text: string): Promise<RecipeComment> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('comments')
    .insert({ recipe_id: recipeId, user_id: userId, content: text })
    .select('id, recipe_id, user_id, content, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapComment(data);
}

/** Deletes a comment only if it belongs to the currently logged-in user. */
export async function deleteCommentById(commentId: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }
}
