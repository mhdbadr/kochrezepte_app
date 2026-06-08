import type { Recipe } from "../models/Recipe";

// Mock data for recipes to be used in the application
export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Tomato Basil Pasta",
    description: "A simple pasta dish with fresh tomatoes and basil.",
    ingredients: ["Pasta", "Tomatoes", "Basil", "Garlic", "Olive Oil"],
    instructions: [
      "Cook the pasta.",
      "Prepare the tomato sauce.",
      "Mix pasta with sauce.",
      "Serve with fresh basil."
    ],
    category: "Pasta",
    imageUrl: "",
    preparationTime: 25,
    rating: 4.5,
    createdAt: "2025-01-01"
  },
  {
    id: "2",
    title: "Avocado Salad",
    description: "Fresh avocado salad with vegetables.",
    ingredients: ["Avocado", "Tomato", "Cucumber", "Lettuce"],
    instructions: [
      "Wash the vegetables.",
      "Cut all ingredients.",
      "Mix everything in a bowl.",
      "Serve fresh."
    ],
    category: "Healthy",
    imageUrl: "",
    preparationTime: 10,
    rating: 4.2,
    createdAt: "2025-01-02"
  },
  {
    id: "3",
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
    imageUrl: "",
    preparationTime: 60,
    rating: 4.9,
    createdAt: "2025-01-03"
  },
  {
    id: "4",
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
    imageUrl: "",
    preparationTime: 20,
    rating: 4.3,
    createdAt: "2025-01-04"
  },
  {
    id: "5",
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
    imageUrl: "",
    preparationTime: 40,
    rating: 4.7,
    createdAt: "2025-01-05"
  },
  {
    id: "6",
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
    imageUrl: "",
    preparationTime: 30,
    rating: 4.6,
    createdAt: "2025-01-06"
  },
  {
    id: "7",
    title: "Pancakes",
    description: "Fluffy breakfast pancakes.",
    ingredients: ["Flour", "Milk", "Eggs", "Sugar"],
    instructions: [
      "Mix all ingredients.",
      "Heat a pan.",
      "Cook pancakes on both sides.",
      "Serve warm."
    ],
    category: "Dessert",
    imageUrl: "",
    preparationTime: 20,
    rating: 4.8,
    createdAt: "2025-01-07"
  },
  {
    id: "8",
    title: "Greek Salad",
    description: "Traditional Greek salad with feta cheese.",
    ingredients: ["Tomato", "Cucumber", "Feta", "Olives"],
    instructions: [
      "Cut the vegetables.",
      "Add feta and olives.",
      "Mix gently.",
      "Serve fresh."
    ],
    category: "Healthy",
    imageUrl: "",
    preparationTime: 15,
    rating: 4.4,
    createdAt: "2025-01-08"
  },
  {
    id: "9",
    title: "Spaghetti Carbonara",
    description: "Italian pasta with creamy sauce.",
    ingredients: ["Spaghetti", "Eggs", "Parmesan", "Bacon"],
    instructions: [
      "Cook the spaghetti.",
      "Prepare the sauce.",
      "Mix everything together.",
      "Serve immediately."
    ],
    category: "Pasta",
    imageUrl: "",
    preparationTime: 25,
    rating: 4.8,
    createdAt: "2025-01-09"
  },
  {
    id: "10",
    title: "Fruit Smoothie",
    description: "Refreshing fruit smoothie.",
    ingredients: ["Banana", "Strawberries", "Milk", "Honey"],
    instructions: [
      "Add all ingredients to a blender.",
      "Blend until smooth.",
      "Pour into a glass.",
      "Serve cold."
    ],
    category: "Quick",
    imageUrl: "",
    preparationTime: 5,
    rating: 4.5,
    createdAt: "2025-01-10"
  }
];