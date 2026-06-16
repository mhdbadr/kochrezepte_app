-- ---------------------------------------------------------
-- 1. User profile data
-- ---------------------------------------------------------
-- auth.users is managed by Supabase Auth.
-- profiles stores extra public user data for our app.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  created_at timestamp with time zone default now()
);

-- ---------------------------------------------------------
-- 2. Recipe categories
-- ---------------------------------------------------------
-- Examples: Vegan, Pasta, Dessert.
create table if not exists public.recipe_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamp with time zone default now()
);

-- ---------------------------------------------------------
-- 3. Recipes
-- ---------------------------------------------------------
-- Main recipe table. Ingredients and steps are stored in separate tables.
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category_id uuid references public.recipe_categories(id) on delete set null,
  image_url text,
  preparation_time integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ---------------------------------------------------------
-- 4. Recipe ingredients
-- ---------------------------------------------------------
-- One recipe can have many ingredients.
-- sort_order keeps the same order as the user entered in the form.
create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0
);

-- ---------------------------------------------------------
-- 5. Recipe steps
-- ---------------------------------------------------------
-- One recipe can have many instruction steps.
create table if not exists public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  instruction text not null,
  sort_order integer not null default 0
);

-- ---------------------------------------------------------
-- 6. Favorites
-- ---------------------------------------------------------
-- A user can save a recipe as favorite only once.
-- The primary key with user_id + recipe_id prevents duplicates.
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (user_id, recipe_id)
);

-- ---------------------------------------------------------
-- 7. Ratings
-- ---------------------------------------------------------
-- A user can rate a recipe only once.
-- rating must be between 1 and 5.
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (user_id, recipe_id)
);

-- ---------------------------------------------------------
-- 8. Comments
-- ---------------------------------------------------------
-- Users can write comments below recipes.
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ---------------------------------------------------------
-- Optional: meal planner table
-- ---------------------------------------------------------
-- Keep this commented out until the weekly planner should use Supabase.
-- create table if not exists public.meal_plan (
--   id uuid primary key default gen_random_uuid(),
--   user_id uuid not null references auth.users(id) on delete cascade,
--   recipe_id uuid not null references public.recipes(id) on delete cascade,
--   planned_date date not null,
--   meal_type text,
--   created_at timestamp with time zone default now()
-- );


-- ---------------------------------------------------------
-- Function 1: Create a profile after signup
-- ---------------------------------------------------------
-- When Supabase creates a new auth.users row, this function creates
-- a matching profiles row for our app.
create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    split_part(new.email, '@', 1)
  );

  return new;
end;
$$;

-- Trigger for function 1.
drop trigger if exists create_profile_after_signup on auth.users;
create trigger create_profile_after_signup
after insert on auth.users
for each row
execute function public.create_profile_for_new_user();

-- ---------------------------------------------------------
-- Function 2: Update updated_at automatically
-- ---------------------------------------------------------
-- This function sets updated_at to the current time whenever a row changes.
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for function 2.
drop trigger if exists update_recipes_updated_at on public.recipes;
create trigger update_recipes_updated_at
before update on public.recipes
for each row
execute function public.update_updated_at_column();

drop trigger if exists update_ratings_updated_at on public.ratings;
create trigger update_ratings_updated_at
before update on public.ratings
for each row
execute function public.update_updated_at_column();

drop trigger if exists update_comments_updated_at on public.comments;
create trigger update_comments_updated_at
before update on public.comments
for each row
execute function public.update_updated_at_column();
