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
  difficulty text not null default 'Einfach' check (difficulty in ('Einfach', 'Mittel', 'Schwer')),
  servings integer not null default 1 check (servings >= 1),
  rating numeric not null default 0,
  rating_count integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.recipes
add column if not exists rating numeric not null default 0;

alter table public.recipes
add column if not exists rating_count integer not null default 0;

alter table public.recipes
add column if not exists difficulty text not null default 'Einfach';

alter table public.recipes
drop constraint if exists recipes_difficulty_check;

alter table public.recipes
add constraint recipes_difficulty_check check (difficulty in ('Einfach', 'Mittel', 'Schwer'));

alter table public.recipes
add column if not exists servings integer not null default 1;

alter table public.recipes
drop constraint if exists recipes_servings_check;

alter table public.recipes
add constraint recipes_servings_check check (servings >= 1);

-- ---------------------------------------------------------
-- 4. Recipe ingredients
-- ---------------------------------------------------------
-- One recipe can have many ingredients.
-- sort_order keeps the same order as the user entered in the form.
create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  name text not null,
  amount numeric,
  unit text,
  sort_order integer not null default 0
);

alter table public.recipe_ingredients
add column if not exists amount numeric;

alter table public.recipe_ingredients
add column if not exists unit text;

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
-- 9. Weekly planner
-- ---------------------------------------------------------
-- Stores planned recipes by weekday for each user.
create table if not exists public.weekly_planner (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  day_of_week text not null,
  created_at timestamp with time zone default now(),
  unique (user_id, recipe_id, day_of_week)
);


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

-- ---------------------------------------------------------
-- Function 3: Update recipe rating summary
-- ---------------------------------------------------------
create or replace function public.update_recipe_rating_summary()
returns trigger
language plpgsql
security definer
as $$
declare
  affected_recipe_id uuid;
begin
  /** Get the recipe_id from the new or old row*/
  affected_recipe_id := coalesce(new.recipe_id, old.recipe_id);

  /** Update the recipe's rating and rating_count based on the ratings table */
  update public.recipes
  set
    rating = coalesce((
      select round(avg(rating)::numeric, 2)
      from public.ratings
      where recipe_id = affected_recipe_id
    ), 0),
    rating_count = (
      select count(*)
      from public.ratings
      where recipe_id = affected_recipe_id
    )
  where id = affected_recipe_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists update_recipe_rating_summary_after_change on public.ratings;
create trigger update_recipe_rating_summary_after_change
after insert or update or delete on public.ratings
for each row
execute function public.update_recipe_rating_summary();
