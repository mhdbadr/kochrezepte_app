import { IonContent, IonPage } from "@ionic/react";
import { Link } from "react-router-dom";
import { getAllRecipes } from "../repositories/recipeRepository";

export default function RecipeListPage() {
  // get all recipes from the repository
  const recipes = getAllRecipes();

  return (
    <IonPage>
      <IonContent fullscreen>
        <main>
          <h1>Recipes</h1>
          <p>
            <Link to="/recipes/new">Create new recipe</Link>
          </p>

          {recipes.map((recipe) => (
            <section key={recipe.id}>
              <h2>
                <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
              </h2>
              <p>{recipe.description}</p>
              <p>Category: {recipe.category}</p>
              <p>Preparation time: {recipe.preparationTime} min</p>
            </section>
          ))}
        </main>
      </IonContent>
    </IonPage>
  );
}
