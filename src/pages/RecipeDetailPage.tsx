import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Link, useParams } from "react-router-dom";
import { getRecipeById } from "../repositories/recipeRepository";

// Define the route parameters used by /recipes/:id.
interface RecipeDetailRouteParams {
  id: string;
}

export default function RecipeDetailPage() {
  // Read the recipe ID from the current URL.
  const { id } = useParams<RecipeDetailRouteParams>();

  // Load the matching recipe from the repository.
  const recipe = getRecipeById(id);

  // Show a clear fallback if the URL contains an unknown recipe ID.
  if (!recipe) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Recipe not found</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <main>
            <p>No recipe exists for ID "{id}".</p>
            <IonButton routerLink="/recipes">Back to recipes</IonButton>
          </main>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{recipe.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <main>
          <Link to="/recipes">Back to recipes</Link>
          <h1>{recipe.title}</h1>
          {/* Render the optional recipe image when the form or mock data provides one. */}
          {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} width="320" />}
          <p>{recipe.description}</p>
          <p>Category: {recipe.category}</p>
          <p>Preparation time: {recipe.preparationTime} min</p>
          {recipe.rating && <p>Rating: {recipe.rating}</p>}

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
