import {
  IonAlert,
  IonButton,
  IonContent,
  IonPage,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import BackLink from "../components/BackLink";
import PageHeader from "../components/PageHeader";
import type { Recipe } from "../models/Recipe";
import { deleteRecipe, getRecipeById } from "../repositories/recipeRepository";
import "./RecipeDetailPage.css";
import CommentSection from '../components/CommentSection';
import { useRatings } from '../hooks/useRatings';

// Define the route parameters used by /recipes/:id.
interface RecipeDetailRouteParams {
  id: string;
}

export default function RecipeDetailPage() {
  const history = useHistory();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [portions, setPortions] = useState<number>(4);

  // Read the recipe ID from the current URL.
  const { id } = useParams<RecipeDetailRouteParams>();

  const { getRecipeRating } = useRatings();
  const currentRating = getRecipeRating(id);

  useEffect(() => {
    let isPageActive = true;

    async function loadRecipe() {
      try {
        // Load the matching recipe from Supabase using the route ID.
        const loadedRecipe = await getRecipeById(id);

        if (isPageActive) {
          setRecipe(loadedRecipe);
          setErrorMessage("");
        }
      } catch (error) {
        if (isPageActive) {
          setErrorMessage(error instanceof Error ? error.message : "Recipe could not be loaded.");
        }
      } finally {
        if (isPageActive) {
          setIsLoading(false);
        }
      }
    }

    loadRecipe();

    return () => {
      isPageActive = false;
    };
  }, [id]);

  // Only recipes created through the form should expose edit and delete actions.
  const canModifyRecipe = recipe?.isEditable === true;

  async function handleDeleteRecipe() {
    if (!recipe || !canModifyRecipe) return;

    try {
      setIsDeleting(true);
      setDeleteErrorMessage("");

      await deleteRecipe(recipe.id); // Delete the recipe from Supabase
      history.push("/home"); // Navigate back to the main recipe overview after deletion
    } catch (error) {
      setDeleteErrorMessage(error instanceof Error ? error.message : "Recipe could not be deleted.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <IonPage>
        <PageHeader title="Loading recipe" />

        <IonContent fullscreen>
          <main>
            <p>Loading recipe...</p>
          </main>
        </IonContent>
      </IonPage>
    );
  }

  if (errorMessage) {
    return (
      <IonPage>
        <PageHeader title="Recipe error" />

        <IonContent fullscreen>
          <main>
            <p>Supabase error: {errorMessage}</p>
            <IonButton routerLink="/home">Back to recipes</IonButton>
          </main>
        </IonContent>
      </IonPage>
    );
  }

  // Show a clear fallback if the URL contains an unknown recipe ID.
  if (!recipe) {
    return (
      <IonPage>
        <PageHeader title="Recipe not found" />

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
      <PageHeader title={recipe.title} />

      <IonContent fullscreen>
        <main className="recipe-detail-page">
          <BackLink to="/home" label="Zurück zur Übersicht" />

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
                <span>⭐ {currentRating || recipe.rating || 0} / 5</span>
              </div>
                          
              <div className="recipe-detail-portions">
                <button 
                  className="recipe-detail-portion-button"
                  onClick={() => portions > 1 && setPortions(portions - 1)}
                >
                  -
                </button>
                <span className="recipe-detail-portion-count">{portions} Portionen</span>
                <button 
                  className="recipe-detail-portion-button"
                  onClick={() => setPortions(portions + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </section>

          {/* Sample recipes stay read-only, while user-created recipes can be managed. */}
          {canModifyRecipe ? (
            <div className="recipe-detail-actions">
              <IonButton routerLink={`/recipes/${recipe.id}/edit`}>Edit recipe</IonButton>
              <IonButton color="danger" onClick={() => setIsDeleteAlertOpen(true)} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete recipe"}
              </IonButton>
            </div>
          ) : (
            <p className="recipe-detail-readonly-note">
              This is a sample recipe. Only recipes you create can be edited or deleted.
            </p>
          )}

          {deleteErrorMessage && (
            <p className="recipe-detail-readonly-note">Delete error: {deleteErrorMessage}</p>
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
                handler: () => {
                  void handleDeleteRecipe();
                },
              },
            ]}
            onDidDismiss={() => setIsDeleteAlertOpen(false)}
          />

          <section className="recipe-detail-content">
            <article className="recipe-detail-card">
              <h2>Ingredients</h2>
              <ul className="recipe-detail-list">
                {recipe.ingredients.map((ingredient, index) => {
                  const baseAmount = ingredient.amount ?? 0;
                  const scaledAmount = (baseAmount / 4) * portions;
                  const formattedAmount =
                    baseAmount > 0
                      ? `${scaledAmount % 1 === 0 ? scaledAmount.toFixed(0) : scaledAmount.toFixed(1)} ${ingredient.unit ?? ''}`.trim()
                      : 'nach Bedarf';

                  return (
                    <li className="recipe-detail-ingredient" key={index}>
                      <span className="recipe-detail-ingredient__amount">{formattedAmount}</span>
                      <span className="recipe-detail-ingredient__name">{ingredient.name}</span>
                    </li>
                  );
                })}
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

        

          <div className="recipe-detail-comments">
            <hr className="recipe-detail-divider" />
            <CommentSection recipeId={recipe.id} /> 
          </div>
        </main>
      </IonContent>
    </IonPage>
  );
}
