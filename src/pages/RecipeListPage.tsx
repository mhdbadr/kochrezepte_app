import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Recipe } from "../models/Recipe";
import { getAllRecipes } from "../repositories/recipeRepository";

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isPageActive = true;

    async function loadRecipes() {
      // Supabase calls are asynchronous, so recipes are loaded after the page renders.
      try {
        const loadedRecipes = await getAllRecipes();

        if (isPageActive) {
          setRecipes(loadedRecipes);
          setErrorMessage("");
        }
      } catch (error) {
        if (isPageActive) {
          setErrorMessage(error instanceof Error ? error.message : "Recipes could not be loaded.");
        }
      } finally {
        if (isPageActive) {
          setIsLoading(false);
        }
      }
    }

    loadRecipes();

    return () => {
      isPageActive = false;
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recipes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <main>
          <h1>Recipes</h1>

          {isLoading && <p>Loading recipes...</p>}

          {errorMessage && <p>Supabase error: {errorMessage}</p>}

          {/* Show an empty state instead of rendering an empty list. */}
          {!isLoading && !errorMessage && recipes.length === 0 && <p>No recipes available.</p>}

          {/* Render one card per recipe and link each title to its detail page. */}
          {recipes.map((recipe) => (
            <IonCard key={recipe.id}>
              <IonCardHeader>
                <IonCardSubtitle>{recipe.category}</IonCardSubtitle>
                <IonCardTitle>
                  {/* Link each recipe to its detail page using the recipe ID from the model. */}
                  <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                </IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <p>{recipe.description}</p>
                <p>Preparation time: {recipe.preparationTime} min</p>
              </IonCardContent>
            </IonCard>
          ))}
        </main>
      </IonContent>
    </IonPage>
  );
}
