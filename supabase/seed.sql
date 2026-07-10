-- =========================================================
-- Kochrezepte App - Seed Data
-- =========================================================
-- Run this after schema.sql.
-- This file inserts default categories and example recipes.
-- =========================================================

-- ---------------------------------------------------------
-- 1. Default categories
-- ---------------------------------------------------------
insert into public.recipe_categories (name) values
                                                ('Vegan'),
                                                ('Vegetarisch'),
                                                ('Dessert'),
                                                ('Schnell'),
                                                ('Pasta'),
                                                ('Hauptgericht'),
                                                ('Gesund')
    on conflict (name) do nothing;

-- ---------------------------------------------------------
-- 2. Remove old sample recipes before inserting them again
-- ---------------------------------------------------------
-- This keeps the seed repeatable without manually fixed UUIDs.
-- Ingredients and steps are deleted automatically because of on delete cascade.
delete from public.recipes
where title in (
  'Pasta Carbonara',
  'Pizza Margherita',
  'Caesar Salad',
  'Chicken Curry',
  'Vegan Buddha Bowl',
  'Chocolate Cake',
  'Vegetable Stir Fry',
  'Pancakes'
);

-- ---------------------------------------------------------
-- 3. Example recipes
-- ---------------------------------------------------------
-- created_by is null because these are public sample recipes.
-- User-created recipes will later use the logged-in user ID.
insert into public.recipes (
  title,
  description,
  category_id,
  image_url,
  preparation_time,
  created_by,
  created_at
) values
  (
    'Pasta Carbonara',
    'Classic pasta with eggs, parmesan, and bacon.',
    (select id from public.recipe_categories where name = 'Pasta'),
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800',
    25,
    null,
    '2025-01-01T00:00:00Z'
  ),
  (
    'Pizza Margherita',
    'Simple pizza with tomato sauce, mozzarella, and basil.',
    (select id from public.recipe_categories where name = 'Hauptgericht'),
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    30,
    null,
    '2025-01-02T00:00:00Z'
  ),
  (
    'Caesar Salad',
    'Fresh salad with chicken, parmesan, and croutons.',
    (select id from public.recipe_categories where name = 'Gesund'),
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
    15,
    null,
    '2025-01-03T00:00:00Z'
  ),
  (
    'Chicken Curry',
    'Creamy chicken curry served with rice.',
    (select id from public.recipe_categories where name = 'Hauptgericht'),
    'https://img.chefkoch-cdn.de/rezepte/1582261265704130/bilder/1573472/crop-960x540/chicken-curry.jpg',
    40,
    null,
    '2025-01-04T00:00:00Z'
  ),
  (
    'Vegan Buddha Bowl',
    'Healthy vegan bowl with quinoa and vegetables.',
    (select id from public.recipe_categories where name = 'Vegan'),
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    30,
    null,
    '2025-01-05T00:00:00Z'
  ),
  (
    'Chocolate Cake',
    'Classic homemade chocolate cake.',
    (select id from public.recipe_categories where name = 'Dessert'),
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    60,
    null,
    '2025-01-06T00:00:00Z'
  ),
  (
    'Vegetable Stir Fry',
    'Quick stir-fried vegetables with soy sauce.',
    (select id from public.recipe_categories where name = 'Vegetarisch'),
    'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=800',
    15,
    null,
    '2025-01-07T00:00:00Z'
  ),
  (
    'Pancakes',
    'Fluffy breakfast pancakes.',
    (select id from public.recipe_categories where name = 'Schnell'),
    'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800',
    20,
    null,
    '2025-01-08T00:00:00Z'
  );

-- ---------------------------------------------------------
-- 4. Ingredients
-- ---------------------------------------------------------
insert into public.recipe_ingredients (recipe_id, name, sort_order) values
  ((select id from public.recipes where title = 'Pasta Carbonara'), 'Spaghetti', 1),
  ((select id from public.recipes where title = 'Pasta Carbonara'), 'Eggs', 2),
  ((select id from public.recipes where title = 'Pasta Carbonara'), 'Parmesan', 3),
  ((select id from public.recipes where title = 'Pasta Carbonara'), 'Bacon', 4),

  ((select id from public.recipes where title = 'Pizza Margherita'), 'Pizza dough', 1),
  ((select id from public.recipes where title = 'Pizza Margherita'), 'Tomatoes', 2),
  ((select id from public.recipes where title = 'Pizza Margherita'), 'Mozzarella', 3),
  ((select id from public.recipes where title = 'Pizza Margherita'), 'Basil', 4),

  ((select id from public.recipes where title = 'Caesar Salad'), 'Lettuce', 1),
  ((select id from public.recipes where title = 'Caesar Salad'), 'Chicken', 2),
  ((select id from public.recipes where title = 'Caesar Salad'), 'Parmesan', 3),
  ((select id from public.recipes where title = 'Caesar Salad'), 'Croutons', 4),

  ((select id from public.recipes where title = 'Chicken Curry'), 'Chicken', 1),
  ((select id from public.recipes where title = 'Chicken Curry'), 'Curry Powder', 2),
  ((select id from public.recipes where title = 'Chicken Curry'), 'Coconut Milk', 3),
  ((select id from public.recipes where title = 'Chicken Curry'), 'Rice', 4),

  ((select id from public.recipes where title = 'Vegan Buddha Bowl'), 'Quinoa', 1),
  ((select id from public.recipes where title = 'Vegan Buddha Bowl'), 'Chickpeas', 2),
  ((select id from public.recipes where title = 'Vegan Buddha Bowl'), 'Avocado', 3),
  ((select id from public.recipes where title = 'Vegan Buddha Bowl'), 'Spinach', 4),

  ((select id from public.recipes where title = 'Chocolate Cake'), 'Flour', 1),
  ((select id from public.recipes where title = 'Chocolate Cake'), 'Cocoa Powder', 2),
  ((select id from public.recipes where title = 'Chocolate Cake'), 'Sugar', 3),
  ((select id from public.recipes where title = 'Chocolate Cake'), 'Eggs', 4),
  ((select id from public.recipes where title = 'Chocolate Cake'), 'Butter', 5),

  ((select id from public.recipes where title = 'Vegetable Stir Fry'), 'Broccoli', 1),
  ((select id from public.recipes where title = 'Vegetable Stir Fry'), 'Carrots', 2),
  ((select id from public.recipes where title = 'Vegetable Stir Fry'), 'Bell Pepper', 3),
  ((select id from public.recipes where title = 'Vegetable Stir Fry'), 'Soy Sauce', 4),

  ((select id from public.recipes where title = 'Pancakes'), 'Flour', 1),
  ((select id from public.recipes where title = 'Pancakes'), 'Milk', 2),
  ((select id from public.recipes where title = 'Pancakes'), 'Eggs', 3),
  ((select id from public.recipes where title = 'Pancakes'), 'Sugar', 4);

-- ---------------------------------------------------------
-- 5. Detailed instruction steps
-- ---------------------------------------------------------
insert into public.recipe_steps (recipe_id, instruction, sort_order) values
  ((select id from public.recipes where title = 'Pasta Carbonara'), 'Bring a large pot of salted water to a boil and cook the spaghetti until al dente.', 1),
  ((select id from public.recipes where title = 'Pasta Carbonara'), 'Whisk the eggs with finely grated parmesan until the mixture is smooth and creamy.', 2),
  ((select id from public.recipes where title = 'Pasta Carbonara'), 'Fry the bacon in a pan until it is crispy, then lower the heat.', 3),
  ((select id from public.recipes where title = 'Pasta Carbonara'), 'Add the warm spaghetti to the pan and mix it with the bacon.', 4),
  ((select id from public.recipes where title = 'Pasta Carbonara'), 'Remove the pan from direct heat and stir in the egg mixture so it becomes creamy without scrambling.', 5),

  ((select id from public.recipes where title = 'Pizza Margherita'), 'Preheat the oven to a high temperature so the pizza base becomes crisp.', 1),
  ((select id from public.recipes where title = 'Pizza Margherita'), 'Roll out the pizza dough on a lightly floured surface.', 2),
  ((select id from public.recipes where title = 'Pizza Margherita'), 'Spread tomato sauce evenly over the dough, leaving a small border around the edge.', 3),
  ((select id from public.recipes where title = 'Pizza Margherita'), 'Add mozzarella slices and fresh basil leaves on top.', 4),
  ((select id from public.recipes where title = 'Pizza Margherita'), 'Bake the pizza until the crust is golden and the cheese is melted.', 5),

  ((select id from public.recipes where title = 'Caesar Salad'), 'Wash the lettuce thoroughly, dry it well, and cut it into bite-sized pieces.', 1),
  ((select id from public.recipes where title = 'Caesar Salad'), 'Season the chicken and cook it in a pan until it is fully cooked through.', 2),
  ((select id from public.recipes where title = 'Caesar Salad'), 'Slice the chicken into strips and let it rest for a few minutes.', 3),
  ((select id from public.recipes where title = 'Caesar Salad'), 'Mix the lettuce with dressing, parmesan, and croutons in a large bowl.', 4),
  ((select id from public.recipes where title = 'Caesar Salad'), 'Place the chicken on top and serve the salad immediately.', 5),

  ((select id from public.recipes where title = 'Chicken Curry'), 'Cook the rice according to the package instructions and keep it warm.', 1),
  ((select id from public.recipes where title = 'Chicken Curry'), 'Cut the chicken into small pieces and fry it in a hot pan until lightly browned.', 2),
  ((select id from public.recipes where title = 'Chicken Curry'), 'Add curry powder and stir well so the chicken is coated with the spices.', 3),
  ((select id from public.recipes where title = 'Chicken Curry'), 'Pour in the coconut milk and let the curry simmer until the sauce thickens.', 4),
  ((select id from public.recipes where title = 'Chicken Curry'), 'Serve the creamy curry with the warm rice.', 5),

  ((select id from public.recipes where title = 'Vegan Buddha Bowl'), 'Rinse the quinoa and cook it in water until it is soft and fluffy.', 1),
  ((select id from public.recipes where title = 'Vegan Buddha Bowl'), 'Prepare the vegetables by washing the spinach and slicing the avocado.', 2),
  ((select id from public.recipes where title = 'Vegan Buddha Bowl'), 'Warm the chickpeas in a pan and season them lightly.', 3),
  ((select id from public.recipes where title = 'Vegan Buddha Bowl'), 'Arrange quinoa, chickpeas, avocado, and spinach in a bowl.', 4),
  ((select id from public.recipes where title = 'Vegan Buddha Bowl'), 'Add your preferred dressing and serve the bowl fresh.', 5),

  ((select id from public.recipes where title = 'Chocolate Cake'), 'Preheat the oven and grease a baking pan with butter.', 1),
  ((select id from public.recipes where title = 'Chocolate Cake'), 'Mix flour, cocoa powder, and sugar in a large bowl.', 2),
  ((select id from public.recipes where title = 'Chocolate Cake'), 'Add eggs and melted butter, then stir until a smooth batter forms.', 3),
  ((select id from public.recipes where title = 'Chocolate Cake'), 'Pour the batter into the baking pan and spread it evenly.', 4),
  ((select id from public.recipes where title = 'Chocolate Cake'), 'Bake the cake until a toothpick inserted in the center comes out clean.', 5),
  ((select id from public.recipes where title = 'Chocolate Cake'), 'Let the cake cool before slicing and serving.', 6),

  ((select id from public.recipes where title = 'Vegetable Stir Fry'), 'Wash and cut all vegetables into similar-sized pieces.', 1),
  ((select id from public.recipes where title = 'Vegetable Stir Fry'), 'Heat a pan or wok over high heat with a small amount of oil.', 2),
  ((select id from public.recipes where title = 'Vegetable Stir Fry'), 'Add the vegetables and stir fry them quickly so they stay crisp.', 3),
  ((select id from public.recipes where title = 'Vegetable Stir Fry'), 'Add soy sauce and toss everything until the vegetables are evenly coated.', 4),
  ((select id from public.recipes where title = 'Vegetable Stir Fry'), 'Serve immediately while the vegetables are hot.', 5),

  ((select id from public.recipes where title = 'Pancakes'), 'Mix flour, milk, eggs, and sugar in a bowl until the batter is smooth.', 1),
  ((select id from public.recipes where title = 'Pancakes'), 'Heat a pan over medium heat and add a small amount of butter or oil.', 2),
  ((select id from public.recipes where title = 'Pancakes'), 'Pour a small portion of batter into the pan and cook until bubbles appear on top.', 3),
  ((select id from public.recipes where title = 'Pancakes'), 'Flip the pancake and cook the other side until golden brown.', 4),
  ((select id from public.recipes where title = 'Pancakes'), 'Serve the pancakes warm with fruit, syrup, or your favorite topping.', 5);
