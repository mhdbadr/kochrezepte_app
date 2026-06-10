import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kochrezepte_comments';

export interface CommentItem {
  id: string;
  recipeId: string;
  text: string;
  createdAt: string;
}

export function useComments() {
  const [allComments, setAllComments] = useState<CommentItem[]>([]);

  useEffect(() => {
    const storedComments = localStorage.getItem(STORAGE_KEY);
    if (storedComments) {
      setAllComments(JSON.parse(storedComments));
    }
  }, []);

  const addComment = (recipeId: string, text: string) => {
    const newComment: CommentItem = {
      id: Date.now().toString(),
      recipeId: recipeId,
      text: text,
      createdAt: new Date().toLocaleDateString('de-DE')
    };

    const updatedComments = [...allComments, newComment];
    setAllComments(updatedComments);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedComments));
  };

  const getCommentsForRecipe = (recipeId: string): CommentItem[] => {
    return allComments.filter(comment => comment.recipeId === recipeId);
  };

  return { addComment, getCommentsForRecipe };
}