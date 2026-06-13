-- =========================================================
-- Kochrezepte App - Seed Data
-- =========================================================
-- Run this after schema.sql.
-- This file inserts default categories and example recipes.
-- The recipe IDs are fixed so this seed file can be run multiple times.
-- =========================================================

-- ---------------------------------------------------------
-- 1. Default categories
-- ---------------------------------------------------------
insert into public.recipe_categories (name) values
  ('Vegan'),
  ('Vegetarian'),
  ('Dessert'),
  ('Quick'),
  ('Pasta'),
  ('Main Dish'),
  ('Healthy')
on conflict (name) do nothing;

-- ---------------------------------------------------------
-- 2. Example recipes
-- ---------------------------------------------------------
-- created_by is null because these are public sample recipes.
-- User-created recipes will later use the logged-in user ID.

insert into public.recipes (
  id,
  title,
  description,
  category_id,
  image_url,
  preparation_time,
  created_by,
  created_at
) values
  (
    '11111111-1111-1111-1111-111111111111',
    'Pasta Carbonara',
    'Classic pasta with eggs, parmesan, and bacon.',
    (select id from public.recipe_categories where name = 'Pasta'),
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800',
    25,
    null,
    '2025-01-01T00:00:00Z'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Pizza Margherita',
    'Simple pizza with tomato sauce, mozzarella, and basil.',
    (select id from public.recipe_categories where name = 'Main Dish'),
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    30,
    null,
    '2025-01-02T00:00:00Z'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Caesar Salad',
    'Fresh salad with chicken, parmesan, and croutons.',
    (select id from public.recipe_categories where name = 'Healthy'),
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
    15,
    null,
    '2025-01-03T00:00:00Z'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Chicken Curry',
    'Creamy chicken curry served with rice.',
    (select id from public.recipe_categories where name = 'Main Dish'),
    'https://img.chefkoch-cdn.de/rezepte/1582261265704130/bilder/1573472/crop-960x540/chicken-curry.jpg',
    40,
    null,
    '2025-01-04T00:00:00Z'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Vegan Buddha Bowl',
    'Healthy vegan bowl with quinoa and vegetables.',
    (select id from public.recipe_categories where name = 'Vegan'),
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    30,
    null,
    '2025-01-05T00:00:00Z'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Chocolate Cake',
    'Classic homemade chocolate cake.',
    (select id from public.recipe_categories where name = 'Dessert'),
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    60,
    null,
    '2025-01-06T00:00:00Z'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Vegetable Stir Fry',
    'Quick stir-fried vegetables with soy sauce.',
    (select id from public.recipe_categories where name = 'Vegetarian'),
    'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=800',
    15,
    null,
    '2025-01-07T00:00:00Z'
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'Pancakes',
    'Fluffy breakfast pancakes.',
    (select id from public.recipe_categories where name = 'Quick'),
    'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800',
    20,
    null,
    '2025-01-08T00:00:00Z'
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  category_id = excluded.category_id,
  image_url = excluded.image_url,
  preparation_time = excluded.preparation_time,
  created_by = excluded.created_by,
  created_at = excluded.created_at;

-- ---------------------------------------------------------
-- 3. Reset ingredients and steps for the seed recipes
-- ---------------------------------------------------------
-- This prevents duplicates when the seed file is run again.

delete from public.recipe_ingredients
where recipe_id in (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888'
);

delete from public.recipe_steps
where recipe_id in (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888'
);

-- ---------------------------------------------------------
-- 4. Ingredients
-- ---------------------------------------------------------
insert into public.recipe_ingredients (recipe_id, name, sort_order) values
  ('11111111-1111-1111-1111-111111111111', 'Spaghetti', 1),
  ('11111111-1111-1111-1111-111111111111', 'Eggs', 2),
  ('11111111-1111-1111-1111-111111111111', 'Parmesan', 3),
  ('11111111-1111-1111-1111-111111111111', 'Bacon', 4),

  ('22222222-2222-2222-2222-222222222222', 'Pizza dough', 1),
  ('22222222-2222-2222-2222-222222222222', 'Tomatoes', 2),
  ('22222222-2222-2222-2222-222222222222', 'Mozzarella', 3),
  ('22222222-2222-2222-2222-222222222222', 'Basil', 4),

  ('33333333-3333-3333-3333-333333333333', 'Lettuce', 1),
  ('33333333-3333-3333-3333-333333333333', 'Chicken', 2),
  ('33333333-3333-3333-3333-333333333333', 'Parmesan', 3),
  ('33333333-3333-3333-3333-333333333333', 'Croutons', 4),

  ('44444444-4444-4444-4444-444444444444', 'Chicken', 1),
  ('44444444-4444-4444-4444-444444444444', 'Curry Powder', 2),
  ('44444444-4444-4444-4444-444444444444', 'Coconut Milk', 3),
  ('44444444-4444-4444-4444-444444444444', 'Rice', 4),

  ('55555555-5555-5555-5555-555555555555', 'Quinoa', 1),
  ('55555555-5555-5555-5555-555555555555', 'Chickpeas', 2),
  ('55555555-5555-5555-5555-555555555555', 'Avocado', 3),
  ('55555555-5555-5555-5555-555555555555', 'Spinach', 4),

  ('66666666-6666-6666-6666-666666666666', 'Flour', 1),
  ('66666666-6666-6666-6666-666666666666', 'Cocoa Powder', 2),
  ('66666666-6666-6666-6666-666666666666', 'Sugar', 3),
  ('66666666-6666-6666-6666-666666666666', 'Eggs', 4),
  ('66666666-6666-6666-6666-666666666666', 'Butter', 5),

  ('77777777-7777-7777-7777-777777777777', 'Broccoli', 1),
  ('77777777-7777-7777-7777-777777777777', 'Carrots', 2),
  ('77777777-7777-7777-7777-777777777777', 'Bell Pepper', 3),
  ('77777777-7777-7777-7777-777777777777', 'Soy Sauce', 4),

  ('88888888-8888-8888-8888-888888888888', 'Flour', 1),
  ('88888888-8888-8888-8888-888888888888', 'Milk', 2),
  ('88888888-8888-8888-8888-888888888888', 'Eggs', 3),
  ('88888888-8888-8888-8888-888888888888', 'Sugar', 4);

-- ---------------------------------------------------------
-- 5. Detailed instruction steps
-- ---------------------------------------------------------
insert into public.recipe_steps (recipe_id, instruction, sort_order) values
  ('11111111-1111-1111-1111-111111111111', 'Bring a large pot of salted water to a boil and cook the spaghetti until al dente.', 1),
  ('11111111-1111-1111-1111-111111111111', 'Whisk the eggs with finely grated parmesan until the mixture is smooth and creamy.', 2),
  ('11111111-1111-1111-1111-111111111111', 'Fry the bacon in a pan until it is crispy, then lower the heat.', 3),
  ('11111111-1111-1111-1111-111111111111', 'Add the warm spaghetti to the pan and mix it with the bacon.', 4),
  ('11111111-1111-1111-1111-111111111111', 'Remove the pan from direct heat and stir in the egg mixture so it becomes creamy without scrambling.', 5),

  ('22222222-2222-2222-2222-222222222222', 'Preheat the oven to a high temperature so the pizza base becomes crisp.', 1),
  ('22222222-2222-2222-2222-222222222222', 'Roll out the pizza dough on a lightly floured surface.', 2),
  ('22222222-2222-2222-2222-222222222222', 'Spread tomato sauce evenly over the dough, leaving a small border around the edge.', 3),
  ('22222222-2222-2222-2222-222222222222', 'Add mozzarella slices and fresh basil leaves on top.', 4),
  ('22222222-2222-2222-2222-222222222222', 'Bake the pizza until the crust is golden and the cheese is melted.', 5),

  ('33333333-3333-3333-3333-333333333333', 'Wash the lettuce thoroughly, dry it well, and cut it into bite-sized pieces.', 1),
  ('33333333-3333-3333-3333-333333333333', 'Season the chicken and cook it in a pan until it is fully cooked through.', 2),
  ('33333333-3333-3333-3333-333333333333', 'Slice the chicken into strips and let it rest for a few minutes.', 3),
  ('33333333-3333-3333-3333-333333333333', 'Mix the lettuce with dressing, parmesan, and croutons in a large bowl.', 4),
  ('33333333-3333-3333-3333-333333333333', 'Place the chicken on top and serve the salad immediately.', 5),

  ('44444444-4444-4444-4444-444444444444', 'Cook the rice according to the package instructions and keep it warm.', 1),
  ('44444444-4444-4444-4444-444444444444', 'Cut the chicken into small pieces and fry it in a hot pan until lightly browned.', 2),
  ('44444444-4444-4444-4444-444444444444', 'Add curry powder and stir well so the chicken is coated with the spices.', 3),
  ('44444444-4444-4444-4444-444444444444', 'Pour in the coconut milk and let the curry simmer until the sauce thickens.', 4),
  ('44444444-4444-4444-4444-444444444444', 'Serve the creamy curry with the warm rice.', 5),

  ('55555555-5555-5555-5555-555555555555', 'Rinse the quinoa and cook it in water until it is soft and fluffy.', 1),
  ('55555555-5555-5555-5555-555555555555', 'Prepare the vegetables by washing the spinach and slicing the avocado.', 2),
  ('55555555-5555-5555-5555-555555555555', 'Warm the chickpeas in a pan and season them lightly.', 3),
  ('55555555-5555-5555-5555-555555555555', 'Arrange quinoa, chickpeas, avocado, and spinach in a bowl.', 4),
  ('55555555-5555-5555-5555-555555555555', 'Add your preferred dressing and serve the bowl fresh.', 5),

  ('66666666-6666-6666-6666-666666666666', 'Preheat the oven and grease a baking pan with butter.', 1),
  ('66666666-6666-6666-6666-666666666666', 'Mix flour, cocoa powder, and sugar in a large bowl.', 2),
  ('66666666-6666-6666-6666-666666666666', 'Add eggs and melted butter, then stir until a smooth batter forms.', 3),
  ('66666666-6666-6666-6666-666666666666', 'Pour the batter into the baking pan and spread it evenly.', 4),
  ('66666666-6666-6666-6666-666666666666', 'Bake the cake until a toothpick inserted in the center comes out clean.', 5),
  ('66666666-6666-6666-6666-666666666666', 'Let the cake cool before slicing and serving.', 6),

  ('77777777-7777-7777-7777-777777777777', 'Wash and cut all vegetables into similar-sized pieces.', 1),
  ('77777777-7777-7777-7777-777777777777', 'Heat a pan or wok over high heat with a small amount of oil.', 2),
  ('77777777-7777-7777-7777-777777777777', 'Add the vegetables and stir fry them quickly so they stay crisp.', 3),
  ('77777777-7777-7777-7777-777777777777', 'Add soy sauce and toss everything until the vegetables are evenly coated.', 4),
  ('77777777-7777-7777-7777-777777777777', 'Serve immediately while the vegetables are hot.', 5),

  ('88888888-8888-8888-8888-888888888888', 'Mix flour, milk, eggs, and sugar in a bowl until the batter is smooth.', 1),
  ('88888888-8888-8888-8888-888888888888', 'Heat a pan over medium heat and add a small amount of butter or oil.', 2),
  ('88888888-8888-8888-8888-888888888888', 'Pour a small portion of batter into the pan and cook until bubbles appear on top.', 3),
  ('88888888-8888-8888-8888-888888888888', 'Flip the pancake and cook the other side until golden brown.', 4),
  ('88888888-8888-8888-8888-888888888888', 'Serve the pancakes warm with fruit, syrup, or your favorite topping.', 5);
