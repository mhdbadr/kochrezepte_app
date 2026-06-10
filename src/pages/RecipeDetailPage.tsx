import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { deleteRecipe, getRecipeById } from "../repositories/recipeRepository";

// Define the route parameters used by /recipes/:id.
interface RecipeDetailRouteParams {
  id: string;
}

export default function RecipeDetailPage() {
  const history = useHistory();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  // Read the recipe ID from the current URL.
  const { id } = useParams<RecipeDetailRouteParams>();

  // Load the matching recipe from the repository.
  const recipe = getRecipeById(id);

  function handleDeleteRecipe() {
    if (!recipe) return;

    deleteRecipe(recipe.id); // Remove the recipe from the repository.
    history.push("/recipes"); // Navigate back to the recipe list after deletion.
  }

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
          <IonButton routerLink={`/recipes/${recipe.id}/edit`}>Edit recipe</IonButton>
          <IonButton color="danger" onClick={() => setIsDeleteAlertOpen(true)}>
            Delete recipe
          </IonButton>
          <IonAlert
            isOpen={isDeleteAlertOpen}
            header="Delete recipe"
            message={`Do you really want to delete "${recipe.title}"?`}
            buttons={[
              {
                text: "Cancel",
                role: "cancel",
                handler: () => setIsDeleteAlertOpen(false),
              },
              {
                text: "Delete",
                role: "destructive",
                handler: handleDeleteRecipe,
              },
            ]}
            onDidDismiss={() => setIsDeleteAlertOpen(false)}
          />
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
