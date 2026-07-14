/**
 * Custom hook to manage comments for a recipe, including loading existing comments and adding new ones.
 */

import { useEffect, useState } from 'react';
import {
  createComment,
  deleteCommentById,
  getCommentsByRecipeId,
  type RecipeComment,
} from '../repositories/commentRepository';
import { getOptionalCurrentUserId } from '../repositories/recipeHelpers';

export function useComments(recipeId: string) {
  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadComments() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        // Comments and the current user are loaded together so the UI can show owner-only actions.
        const [commentsFromSupabase, userId] = await Promise.all([
          getCommentsByRecipeId(recipeId),
          getOptionalCurrentUserId(),
        ]);

        setComments(commentsFromSupabase);
        setCurrentUserId(userId);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Comments could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadComments();
  }, [recipeId]);

  // Adds a new comment for the current recipe and updates the local state.
  async function addComment(text: string) {
    try {
      setErrorMessage('');

      const createdComment = await createComment(recipeId, text);
      setComments((currentComments) => [...currentComments, createdComment]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Comment could not be saved.');
    }
  }

  // Deletes one of the current user's own comments from Supabase and local state.
  async function deleteComment(commentId: string) {
    try {
      setErrorMessage('');

      await deleteCommentById(commentId);
      setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Comment could not be deleted.');
    }
  }

  return { comments, currentUserId, addComment, deleteComment, isLoading, errorMessage };
}
