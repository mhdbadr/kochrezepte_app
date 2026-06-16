-- =========================================================
-- Kochrezepte App - Row Level Security Rules
-- =========================================================
-- RLS means: Supabase checks every select/insert/update/delete.
-- The app can only access rows allowed by these policies.
--
-- Simple rule summary:
-- 1. Everyone can read recipes, categories, ingredients, steps, ratings and comments.
-- 2. Only logged-in users can create recipes.
-- 3. Users can update/delete only their own recipes.
-- 4. Users can manage only their own favorites and ratings.
-- 5. Users can update/delete only their own comments.
-- =========================================================

-- ---------------------------------------------------------
-- 1. Enable RLS on all app tables
-- ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.recipe_categories enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.favorites enable row level security;
alter table public.ratings enable row level security;
alter table public.comments enable row level security;

-- =========================================================
-- Profiles
-- =========================================================
-- Everyone can read profiles, but users can update only their own profile.

drop policy if exists "Profiles are readable by everyone" on public.profiles;
create policy "Profiles are readable by everyone"
on public.profiles
for select
using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- =========================================================
-- Categories
-- =========================================================
-- Categories are fixed app data, so everyone can read them.

drop policy if exists "Categories are readable by everyone" on public.recipe_categories;
create policy "Categories are readable by everyone"
on public.recipe_categories
for select
using (true);

-- =========================================================
-- Recipes
-- =========================================================
-- Public read: users can browse recipes without logging in.
-- Write access: users can create/edit/delete only their own recipes.

drop policy if exists "Recipes are readable by everyone" on public.recipes;
create policy "Recipes are readable by everyone"
on public.recipes
for select
using (true);

drop policy if exists "Authenticated users can create recipes" on public.recipes;
create policy "Authenticated users can create recipes"
on public.recipes
for insert
with check (auth.uid() = created_by);

drop policy if exists "Users can update their own recipes" on public.recipes;
create policy "Users can update their own recipes"
on public.recipes
for update
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

drop policy if exists "Users can delete their own recipes" on public.recipes;
create policy "Users can delete their own recipes"
on public.recipes
for delete
using (auth.uid() = created_by);

-- =========================================================
-- Recipe ingredients
-- =========================================================
-- Everyone can read ingredients.
-- Only the creator of the parent recipe can change ingredients.
-- The exists(...) part checks the connected recipe row.

drop policy if exists "Ingredients are readable by everyone" on public.recipe_ingredients;
create policy "Ingredients are readable by everyone"
on public.recipe_ingredients
for select
using (true);

drop policy if exists "Recipe creators can manage ingredients" on public.recipe_ingredients;
create policy "Recipe creators can manage ingredients"
on public.recipe_ingredients
for all
using (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_ingredients.recipe_id
    and recipes.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_ingredients.recipe_id
    and recipes.created_by = auth.uid()
  )
);

-- =========================================================
-- Recipe steps
-- =========================================================
-- Everyone can read steps.
-- Only the creator of the parent recipe can change steps.

drop policy if exists "Steps are readable by everyone" on public.recipe_steps;
create policy "Steps are readable by everyone"
on public.recipe_steps
for select
using (true);

drop policy if exists "Recipe creators can manage steps" on public.recipe_steps;
create policy "Recipe creators can manage steps"
on public.recipe_steps
for all
using (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_steps.recipe_id
    and recipes.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_steps.recipe_id
    and recipes.created_by = auth.uid()
  )
);

-- =========================================================
-- Favorites
-- =========================================================
-- Favorites are private. A user sees and changes only their own favorites.

drop policy if exists "Users can read their own favorites" on public.favorites;
create policy "Users can read their own favorites"
on public.favorites
for select
using (auth.uid() = user_id);

drop policy if exists "Users can create their own favorites" on public.favorites;
create policy "Users can create their own favorites"
on public.favorites
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own favorites" on public.favorites;
create policy "Users can delete their own favorites"
on public.favorites
for delete
using (auth.uid() = user_id);

-- =========================================================
-- Ratings
-- =========================================================
-- Everyone can read ratings because the app needs average ratings.
-- Users can create/update/delete only their own rating.

drop policy if exists "Ratings are readable by everyone" on public.ratings;
create policy "Ratings are readable by everyone"
on public.ratings
for select
using (true);

drop policy if exists "Users can create their own ratings" on public.ratings;
create policy "Users can create their own ratings"
on public.ratings
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own ratings" on public.ratings;
create policy "Users can update their own ratings"
on public.ratings
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own ratings" on public.ratings;
create policy "Users can delete their own ratings"
on public.ratings
for delete
using (auth.uid() = user_id);

-- =========================================================
-- Comments
-- =========================================================
-- Everyone can read comments.
-- Users can create/update/delete only their own comments.

drop policy if exists "Comments are readable by everyone" on public.comments;
create policy "Comments are readable by everyone"
on public.comments
for select
using (true);

drop policy if exists "Users can create their own comments" on public.comments;
create policy "Users can create their own comments"
on public.comments
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own comments" on public.comments;
create policy "Users can update their own comments"
on public.comments
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own comments" on public.comments;
create policy "Users can delete their own comments"
on public.comments
for delete
using (auth.uid() = user_id);
