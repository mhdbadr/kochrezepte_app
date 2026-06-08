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
import { Link } from "react-router-dom";
import { getAllRecipes } from "../repositories/recipeRepository";

export default function RecipeListPage() {
  // Load all recipes from the repository for the list view.
  const recipes = getAllRecipes();

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

          {recipes.length === 0 && <p>No recipes available.</p>}

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
