import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { calendarOutline, closeOutline, createOutline, heart, heartOutline, trashOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import BackLink from "../components/BackLink";
import PageHeader from "../components/PageHeader";
import RatingComponent from '../components/RatingComponent';
import type { Recipe } from "../models/Recipe";
import { deleteRecipe, getRecipeById } from "../repositories/recipeRepository";
import { addRecipeToPlanner } from "../repositories/plannerRepository";
import "./RecipeDetailPage.css";
import CommentSection from '../components/CommentSection';
import { useRatings } from '../hooks/useRatings';
import { useFavorites } from '../hooks/useFavorites';
import { isGuest } from '../utils/auth';

// Define the route parameters used by /recipes/:id.
interface RecipeDetailRouteParams {
  id: string;
}

/**
 * Days of the week in German, used for displaying options in the planner modal.
 */
const DAYS_OF_WEEK = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

/**
 * Formats a date string into a human-readable format (DD.MM.YYYY) for display in the recipe detail page.
 * @param dateValue
 */
function formatRecipeDate(dateValue?: string): string {
  if (!dateValue) {
    return "Datum unbekannt";
  }

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateValue));
}

export default function RecipeDetailPage() {
  const history = useHistory();
  const [present] = useIonToast();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [plannerErrorMessage, setPlannerErrorMessage] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingToPlanner, setIsAddingToPlanner] = useState(false);
  const [portions, setPortions] = useState<number>(4);

  // Read the recipe ID from the current URL.
  const { id } = useParams<RecipeDetailRouteParams>();

  const { getRecipeRating ,saveRating} = useRatings();
  const currentRating = getRecipeRating(id);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let isPageActive = true;

    async function loadRecipe() {
      try {
        // Load the matching recipe from Supabase using the route ID.
        const loadedRecipe = await getRecipeById(id);

        if (isPageActive) {
          setRecipe(loadedRecipe);
          setPortions(loadedRecipe?.servings ?? 4);
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
  const canRateRecipe = !canModifyRecipe;
  const isRecipeFavorite = recipe ? isFavorite(recipe.id) : false;


  /**
    * Handles the toggling of the favorite status for the current recipe.
   */
  async function handleToggleDetailFavorite() {
    if (!recipe) return;

    if (isGuest()) {
      present("Bitte melde dich an, um Favoriten zu speichern.", 2000);
      return;
    }

    await toggleFavorite(recipe.id);
    present(
      isRecipeFavorite
        ? "Rezept wurde aus den Favoriten entfernt."
        : "Rezept wurde zu den Favoriten hinzugefuegt.",
      2000,
    );
  }

  /**
   * Handles adding the current recipe to the weekly planner for a specific day of the week.
   * @param dayOfWeek
   */
  async function handleAddRecipeToPlanner(dayOfWeek: string) {
    if (!recipe) return;

    try {
      setIsAddingToPlanner(true);
      setPlannerErrorMessage("");

      await addRecipeToPlanner(dayOfWeek, recipe.id);
      setIsPlannerModalOpen(false);
      present(`Rezept wurde fuer ${dayOfWeek} eingeplant.`, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Recipe could not be added to planner.";
      setPlannerErrorMessage(message);
      present(message, 2500);
    } finally {
      setIsAddingToPlanner(false);
    }
  }

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
                <span>{recipe.difficulty}</span>
                <span>Fuer {recipe.servings} {recipe.servings === 1 ? "Person" : "Personen"}</span>
                <span>Erstellt am {formatRecipeDate(recipe.createdAt)}</span>
                <span>
                  ⭐ {recipe.rating ? recipe.rating.toFixed(1) : '0.0'} / 5
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <button 
                  className="recipe-detail-portion-button"
                  onClick={() => portions > 1 && setPortions(portions - 1)}
                >
                  -
                </button>
                <span className="recipe-detail-portion-count">{portions} {portions === 1 ? "Person" : "Personen"}</span>
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
          {canModifyRecipe && (
            <div className="recipe-detail-owner-actions">
              <IonButton
                className="recipe-detail-owner-button recipe-detail-owner-button--edit"
                fill="outline"
                routerLink={`/recipes/${recipe.id}/edit`}
              >
                <IonIcon icon={createOutline} slot="start" />
                bearbeiten
              </IonButton>

              <IonButton
                className="recipe-detail-owner-button recipe-detail-owner-button--delete"
                fill="outline"
                onClick={() => setIsDeleteAlertOpen(true)}
                disabled={isDeleting}
              >
                <IonIcon icon={trashOutline} slot="start" />
                {isDeleting ? "Wird geloescht..." : "loeschen"}
              </IonButton>
            </div>
          )}

          <div className="recipe-detail-primary-actions">
            <IonButton
              className={`recipe-detail-favorite-button ${isRecipeFavorite ? "recipe-detail-favorite-button--active" : ""}`}
              expand="block"
              onClick={() => void handleToggleDetailFavorite()}
            >
              <IonIcon icon={isRecipeFavorite ? heart : heartOutline} slot="start" />
              {isRecipeFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufuegen"}
            </IonButton>

            <IonButton
              className="recipe-detail-planner-button"
              expand="block"
              fill="outline"
              onClick={() => setIsPlannerModalOpen(true)}
            >
              <IonIcon icon={calendarOutline} slot="start" />
              Rezept einplanen
            </IonButton>
          </div>

          {plannerErrorMessage && (
            <p className="recipe-detail-readonly-note">Planner error: {plannerErrorMessage}</p>
          )}
                   
          {canRateRecipe && (
          <div className="recipe-detail-rating-container">
            <article className="recipe-detail-card recipe-detail-rating-card">
              
              <div className="recipe-detail-rating-text">
                <h3>Wie schmeckt dir dieses Rezept?</h3>
                <p>Gib deine persönliche Bewertung ab</p>
              </div>

               <div className="recipe-detail-rating-stars">
                  <RatingComponent 
                    initialRating={currentRating} 
                    onRatingChange={async (newStars) => {
                      try {
                        // 1. Speichere die persönliche Bewertung des Nutzers
                        await saveRating(recipe.id, newStars); 
                        
                        // 2. Lade das Rezept neu, damit der von Supabase 
                        //    berechnete Durchschnitt (Trigger) ins Frontend kommt
                        const updatedRecipe = await getRecipeById(recipe.id);
                        if (updatedRecipe) {
                          setRecipe(updatedRecipe);
                        }
                      } catch (err) {
                        console.error("Fehler beim Aktualisieren der Bewertung:", err);
                      }
                    }} 
                  />
               </div>

            </article>
          </div>
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

          <IonModal isOpen={isPlannerModalOpen} onDidDismiss={() => setIsPlannerModalOpen(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Wochentag waehlen</IonTitle>
                <IonButton slot="end" fill="clear" onClick={() => setIsPlannerModalOpen(false)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonToolbar>
            </IonHeader>

            <IonContent>
              <div className="recipe-detail-planner-modal">
                <section className="recipe-detail-planner-modal__intro">
                  {recipe.imageUrl && (
                    <img src={recipe.imageUrl} alt={recipe.title} />
                  )}
                  <div>
                    <p>Wochenplanung</p>
                    <h2>{recipe.title}</h2>
                    <span>Waehle einen Tag aus, an dem du dieses Rezept kochen moechtest.</span>
                  </div>
                </section>

                <IonList className="recipe-detail-day-list" lines="none">
                  {DAYS_OF_WEEK.map((day) => (
                    <IonItem
                      button
                      className="recipe-detail-day-item"
                      disabled={isAddingToPlanner}
                      key={day}
                      onClick={() => void handleAddRecipeToPlanner(day)}
                    >
                      <IonIcon icon={calendarOutline} slot="start" />
                      <IonLabel>{day}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </div>
            </IonContent>
          </IonModal>

          <section className="recipe-detail-content">
            <article className="recipe-detail-card">
              <h2>Ingredients</h2>
              <ul className="recipe-detail-list">
                {recipe.ingredients.map((ingredient, index) => {
                  const baseAmount = ingredient.amount ?? 0;
                  const scaledAmount = (baseAmount / recipe.servings) * portions;
                  const formattedAmount =
                    baseAmount > 0
                      ? `${scaledAmount % 1 === 0 ? scaledAmount.toFixed(0) : scaledAmount.toFixed(1)} ${ingredient.unit ?? ''}`.trim()
                      : 'n. B.';

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
                  <li key={index}>
                    <span className="recipe-detail-step__text">{step}</span>
                  </li>
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
