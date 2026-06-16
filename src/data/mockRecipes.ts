import type { Recipe } from "../models/Recipe";

// Legacy mock data kept only as reference/test data.
// The current app loads recipes from Supabase through recipeRepository.ts.
export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Pasta Carbonara",
    description: "Classic pasta with eggs, parmesan, and bacon.",
    ingredients: ["Spaghetti", "Eggs", "Parmesan", "Bacon"],
    instructions: [
      "Cook the spaghetti.",
      "Mix eggs with parmesan.",
      "Fry the bacon.",
      "Combine everything while the pasta is warm."
    ],
    category: "Pasta",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800",
    preparationTime: 25,
    rating: 5,
    createdAt: "2025-01-01"
  },
  {
    id: "2",
    title: "Pizza Margherita",
    description: "Simple pizza with tomato sauce, mozzarella, and basil.",
    ingredients: ["Pizza dough", "Tomatoes", "Mozzarella", "Basil"],
    instructions: [
      "Prepare the dough.",
      "Spread tomato sauce on top.",
      "Add mozzarella and basil.",
      "Bake until crispy."
    ],
    category: "Main Dish",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    preparationTime: 30,
    rating: 4,
    createdAt: "2025-01-02"
  },
  {
    id: "3",
    title: "Caesar Salad",
    description: "Fresh salad with chicken, parmesan, and croutons.",
    ingredients: ["Lettuce", "Chicken", "Parmesan", "Croutons"],
    instructions: [
      "Wash and cut the lettuce.",
      "Cook the chicken.",
      "Add parmesan and croutons.",
      "Serve with dressing."
    ],
    category: "Healthy",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
    preparationTime: 15,
    rating: 5,
    createdAt: "2025-01-03"
  },
  {
    id: "4",
    title: "Chicken Curry",
    description: "Creamy chicken curry served with rice.",
    ingredients: ["Chicken", "Curry Powder", "Coconut Milk", "Rice"],
    instructions: [
      "Cook the chicken.",
      "Add curry spices.",
      "Add coconut milk.",
      "Serve with rice."
    ],
    category: "Main Dish",
    imageUrl: "https://img.chefkoch-cdn.de/rezepte/1582261265704130/bilder/1573472/crop-960x540/chicken-curry.jpg",
    preparationTime: 40,
    rating: 4,
    createdAt: "2025-01-04"
  },
  {
    id: "5",
    title: "Vegan Buddha Bowl",
    description: "Healthy vegan bowl with quinoa and vegetables.",
    ingredients: ["Quinoa", "Chickpeas", "Avocado", "Spinach"],
    instructions: [
      "Cook the quinoa.",
      "Prepare the vegetables.",
      "Arrange all ingredients in a bowl.",
      "Serve with dressing."
    ],
    category: "Vegan",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    preparationTime: 30,
    rating: 4,
    createdAt: "2025-01-05"
  },
  {
    id: "6",
    title: "Chocolate Cake",
    description: "Classic homemade chocolate cake.",
    ingredients: ["Flour", "Cocoa Powder", "Sugar", "Eggs", "Butter"],
    instructions: [
      "Prepare the batter.",
      "Pour batter into a baking pan.",
      "Bake for 35 minutes.",
      "Let the cake cool before serving."
    ],
    category: "Dessert",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
    preparationTime: 60,
    rating: 5,
    createdAt: "2025-01-06"
  },
  {
    id: "7",
    title: "Vegetable Stir Fry",
    description: "Quick stir-fried vegetables with soy sauce.",
    ingredients: ["Broccoli", "Carrots", "Bell Pepper", "Soy Sauce"],
    instructions: [
      "Cut the vegetables.",
      "Heat a pan.",
      "Stir fry the vegetables.",
      "Add soy sauce and serve."
    ],
    category: "Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=800",
    preparationTime: 15,
    rating: 4,
    createdAt: "2025-01-07"
  },
  {
    id: "8",
    title: "Pancakes",
    description: "Fluffy breakfast pancakes.",
    ingredients: ["Flour", "Milk", "Eggs", "Sugar"],
    instructions: [
      "Mix all ingredients.",
      "Heat a pan.",
      "Cook pancakes on both sides.",
      "Serve warm."
    ],
    category: "Quick",
    imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800",
    preparationTime: 20,
    rating: 5,
    createdAt: "2025-01-08"
  }
];
