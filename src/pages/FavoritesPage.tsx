import {
  IonAlert,
  IonContent,
  IonPage,
  IonText,IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonList, IonItem, IonLabel
} from '@ionic/react';
import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import RecipeCard from '../components/RecipeCard';
import { useFavorites } from '../hooks/useFavorites';
import type { Recipe } from '../models/Recipe';
import { getAllRecipes } from '../repositories/recipeRepository';
import './FavoritesPage.css';
import { calendarOutline, closeOutline } from 'ionicons/icons';
import { addRecipeToPlanner } from '../repositories/plannerRepository';
import { isGuest } from '../utils/auth';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeToRemove, setRecipeToRemove] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [recipeToPlan, setRecipeToPlan] = useState<Recipe | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    async function loadRecipes() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        // Favorites use Supabase recipe data and only keep the favorite IDs locally.
        const recipesFromSupabase = await getAllRecipes();
        setRecipes(recipesFromSupabase);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Favorite recipes could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    }

    loadRecipes();
  }, []);

  // Get the full recipe data for every recipe ID saved as a favorite.
  const favoriteRecipes = recipes.filter((recipe) => favorites.includes(recipe.id));

  function confirmRemoveFavorite() {
    if (!recipeToRemove) return; // Safety check, should never happen.

    toggleFavorite(recipeToRemove.id);
    setRecipeToRemove(null);
  }

  async function handleAddIntoPlanner(day: string) {
  if (!recipeToPlan) return;
  try {
    await addRecipeToPlanner(day, recipeToPlan.id);
    setIsPlanModalOpen(false);
    setRecipeToPlan(null);
  } catch (error) {
    console.error("Fehler beim Hinzufügen zum Planer:", error);
  }
}

  return (
    <IonPage>
      <PageHeader title="Meine Favoriten" />

      <IonContent className="ion-padding">
        <main className="favorites-page">
          <section className="favorites-intro">
            <p>Kochbuch</p>
            <h1>Deine Lieblingsrezepte</h1>
            <span>Alle Rezepte, die du mit dem Herz markierst, erscheinen hier als schnelle Sammlung.</span>
          </section>

          {isGuest() && (
              <div className="favorites-guest-banner">
                  Du bist als Gast angemeldet. Bitte melde dich an, um deine persönliche Favoritenliste zu nutzen!
              </div>
          )}
          {isLoading && (
            <IonText color="medium">
              <p>Favoriten werden geladen...</p>
            </IonText>
          )}

          {errorMessage && (
            <IonText color="danger">
              <p>{errorMessage}</p>
            </IonText>
          )}

          {!isLoading && !errorMessage && favoriteRecipes.length === 0 ? (
            <div className="favorites-empty">
              <IonText color="medium">
                <h3>Du hast noch keine Favoriten gespeichert.</h3>
                <p>Klicke auf das Herz bei einem Rezept, um es hier zu sehen!</p>
              </IonText>
            </div>
          ) : (
            <div className="favorites-grid">
              {favoriteRecipes.map((recipe) => (
                <div key={recipe.id} className="favorite-item-container">
                <RecipeCard
                  id={recipe.id}
                  key={recipe.id}
                  title={recipe.title}
                  imageUrl={recipe.imageUrl ?? ''}
                  duration={recipe.preparationTime}
                  difficulty={recipe.difficulty}
                  category={recipe.category}
                  rating={recipe.rating}
                  to={`/recipes/${recipe.id}`}
                  isFavorite={true}
                  onFavoriteToggle={() => setRecipeToRemove(recipe)}
                />
              <div className="favorite-action-bar">
                    <IonButton
                      className="recipe-detail-planner-button"
                      expand="block"
                      fill="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); 
                        setRecipeToPlan(recipe);
                        setIsPlanModalOpen(true);
                      }}
                    >
                      <IonIcon icon={calendarOutline} slot="start" />
                      Rezept einplanen
                    </IonButton>
                  </div>
                </div>
              ))} 
            </div>
          )}

          {/* Confirmation alert when the user tries to remove a recipe from favorites. */}
          <IonAlert
            isOpen={recipeToRemove !== null}
            header="Favorit entfernen"
            message={
              recipeToRemove
                ? `Moechtest du "${recipeToRemove.title}" wirklich aus deinen Favoriten entfernen?`
                : ''
            }
            buttons={[
              {
                text: 'Abbrechen',
                role: 'cancel',
                handler: () => setRecipeToRemove(null),
              },
              {
                text: 'Ja, entfernen',
                role: 'destructive',
                handler: confirmRemoveFavorite,
              },
            ]}
            onDidDismiss={() => setRecipeToRemove(null)}
          />

        <IonModal 
              isOpen={isPlanModalOpen} 
              onDidDismiss={() => setIsPlanModalOpen(false)}>
              

             <IonHeader>
                <IonToolbar>
                  <IonTitle>Wochentag waehlen</IonTitle>
                  <IonButton slot="end" fill="clear" onClick={() => setIsPlanModalOpen(false)}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </IonToolbar>
              </IonHeader>
              
              <IonContent>
                      <div className="recipe-detail-planner-modal">
                        <section className="recipe-detail-planner-modal__intro">
                          {recipeToPlan?.imageUrl && (
                            <img src={recipeToPlan.imageUrl} alt={recipeToPlan.title} />
                          )}
                          <div>
                            <p>Wochenplanung</p>
                            <h2>{recipeToPlan?.title}</h2>
                            <span>Waehle einen Tag aus, an dem du dieses Rezept kochen moechtest.</span>
                          </div>
                        </section>

                        <IonList className="recipe-detail-day-list" lines="none">
                          {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].map((day) => (
                            <IonItem
                              button
                              className="recipe-detail-day-item"
                              key={day}
                              onClick={() => handleAddIntoPlanner(day)}
                            >
                              <IonIcon icon={calendarOutline} slot="start" />
                              <IonLabel>{day}</IonLabel>
                            </IonItem>
                          ))}
                        </IonList>
                      </div>
                  </IonContent>
         
         </IonModal>

        </main>
      </IonContent>
    </IonPage>
  );
}
