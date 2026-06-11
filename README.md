# Kochrezepte App

University software project for a mobile recipe application built with Ionic, React and TypeScript.

## Current Status

The app contains the first working feature set for recipe management and navigation.

Implemented:

- Home page with recipe cards and category filter
- Search page with recipe and ingredient search preparation
- Recipe list page
- Recipe detail page
- Create recipe form
- Edit recipe page for user-created recipes
- Delete recipe flow with confirmation modal
- Mock recipe repository
- Basic routing for recipe pages

Planned:

- Supabase database integration
- Authentication
- Favorites
- Ratings
- Comments
- Sharing
- Persistent recipe storage

## Tech Stack

- Ionic React
- React
- TypeScript
- Capacitor
- Swiper
- Supabase planned for database and authentication

## Setup

Install dependencies:

```bash
npm install
```
Install Swiper for the home page carousel:
```bash
npm install swiper
```

Build the project:

```bash
ionic serve
```

## Important Routes

```text
/home                Home page
/search              Search page
/planner             Weekly planner
/favorites           Favorites page
/recipes/new         Create recipe page
/recipes/:id         Recipe detail page
/recipes/:id/edit    Edit recipe page
```

## Recipe Core

The recipe core currently uses mock data instead of a real database.

Important files:

```text
src/models/Recipe.ts
src/models/RecipeCategory.ts
src/data/mockRecipes.ts
src/repositories/recipeRepository.ts
src/pages/RecipeListPage.tsx
src/pages/RecipeDetailPage.tsx
src/pages/RecipeForm.tsx
src/pages/EditRecipePage.tsx
```

Repository functions:

```ts
getAllRecipes()
getRecipeById(id)
createRecipe(recipe)
updateRecipe(recipe)
deleteRecipe(id)
```

## Editing And Deleting Recipes

Only recipes created through the app form can be edited or deleted.

This is controlled by:

```ts
isEditable: true
```

Sample recipes from `mockRecipes.ts` are read-only.

## Project Structure

```text
src/
  assets/
  components/
  data/
  hooks/
  models/
  pages/
  repositories/
  theme/
  App.tsx
  main.tsx
```

## Team Branches

```text
epic/recipe-core
epic/app-navigation-search
epic/user-interactions
```