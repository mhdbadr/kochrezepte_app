/**
 * Database shape returned by the Supabase recipe query.
 * The UI maps this normalized shape into the simpler Recipe model.
 */
export interface SupabaseRecipeRow {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  preparation_time: number;
  created_at: string | null;
  created_by: string | null;
  recipe_categories: { name: string } | { name: string }[] | null;
  recipe_ingredients: Array<{
    name: string;
    sort_order: number;
    amount: number | null; 
    unit: string | null;
  }>;
  recipe_steps: Array<{
    instruction: string;
    sort_order: number;
  }>;
}
