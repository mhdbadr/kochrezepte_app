import { IonContent, IonPage } from "@ionic/react";
import { Link, useParams } from "react-router-dom";
import { getRecipeById } from "../repositories/recipeRepository";

// Define the route parameters for the recipe detail page
interface RecipeDetailRouteParams {
  id: string;
}


export default function RecipeDetailPage() {
  // Get the recipe ID from the route parameters
  const { id } = useParams<RecipeDetailRouteParams>();
  // Fetch the recipe details using the ID
  const recipe = getRecipeById(id);

  // If the recipe is not found, display a message
  if (!recipe) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <main>
            <p>Recipe not found.</p>
            <Link to="/recipes">Back to recipes</Link>
          </main>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <main>
          <Link to="/recipes">Back to recipes</Link>
          <h1>{recipe.title}</h1>
          <p>{recipe.description}</p>

          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </main>
      </IonContent>
    </IonPage>
  );
}
