/**
 * This file contains the SQL queries for the recipe repository.
 */

export const recipeSelectQuery = `
  id,
  title,
  description,
  image_url,
  preparation_time,
  created_at,
  created_by,
  recipe_categories (
    name
  ),
  recipe_ingredients (
    name,
    sort_order
  ),
  recipe_steps (
    instruction,
    sort_order
  )
`;