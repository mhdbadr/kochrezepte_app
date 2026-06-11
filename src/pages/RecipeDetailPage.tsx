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
import "./RecipeDetailPage.css";
import CommentSection from '../components/CommentSection';

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

  // Only recipes created through the form should expose edit and delete actions.
  const canModifyRecipe = recipe?.isEditable === true;

  function handleDeleteRecipe() {
    if (!recipe || !canModifyRecipe) return;

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
        <main className="recipe-detail-page">
          <Link className="recipe-detail-back-link" to="/home">Back to recipes</Link>

          <section className="recipe-detail-hero">
            {recipe.imageUrl && (
              <img className="recipe-detail-hero__image" src={recipe.imageUrl} alt={recipe.title} />
            )}

            <div className="recipe-detail-hero__overlay">
              <p className="recipe-detail-category">{recipe.category}</p>
              <h1>{recipe.title}</h1>
              <p>{recipe.description}</p>

              <div className="recipe-detail-meta">
                <span>{recipe.preparationTime} Min</span>
                {recipe.rating && <span>{recipe.rating} / 5</span>}
              </div>
            </div>
          </section>

          {/* Sample recipes stay read-only, while user-created recipes can be managed. */}
          {canModifyRecipe ? (
            <div className="recipe-detail-actions">
              <IonButton routerLink={`/recipes/${recipe.id}/edit`}>Edit recipe</IonButton>
              <IonButton color="danger" onClick={() => setIsDeleteAlertOpen(true)}>
                Delete recipe
              </IonButton>
            </div>
          ) : (
            <p className="recipe-detail-readonly-note">
              This is a sample recipe. Only recipes you create can be edited or deleted.
            </p>
          )}

          {/* Confirm destructive actions before removing a recipe. */}
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

          {/* Ingredients and instructions are separated for a clearer recipe detail layout. */}
          <section className="recipe-detail-content">
            <article className="recipe-detail-card">
              <h2>Ingredients</h2>
              <ul className="recipe-detail-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </article>

            <article className="recipe-detail-card">
              <h2>Instructions</h2>
              <ol className="recipe-detail-steps">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </article>
          </section>
          <div style={{ padding: '0 16px 24px' }}>
            <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '24px 0' }} />
            <CommentSection recipeId={recipe.id} /> 
          </div>
        </main>
      </IonContent>
    </IonPage>
  );
}
