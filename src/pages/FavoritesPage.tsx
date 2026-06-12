import {
  IonAlert,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import type { Recipe } from '../models/Recipe';
import RecipeCard from '../components/RecipeCard';
import { mockRecipes } from '../data/mockRecipes';
import { useFavorites } from '../hooks/useFavorites';
import './FavoritesPage.css';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [recipeToRemove, setRecipeToRemove] = useState<Recipe | null>(null);

  // Get the full recipe data for every recipe ID saved as a favorite.
  const favoriteRecipes = mockRecipes.filter((recipe) => favorites.includes(recipe.id));

  function confirmRemoveFavorite() {
    if (!recipeToRemove)  return; // Safety check, should never happen

    toggleFavorite(recipeToRemove.id);
    setRecipeToRemove(null);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Meine Favoriten</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <main className="favorites-page">
          <section className="favorites-intro">
            <p>Kochbuch</p>
            <h1>Deine Lieblingsrezepte</h1>
            <span>Alle Rezepte, die du mit dem Herz markierst, erscheinen hier als schnelle Sammlung.</span>
          </section>

          {favoriteRecipes.length === 0 ? (
            <div className="favorites-empty">
              <IonText color="medium">
                <h3>Du hast noch keine Favoriten gespeichert.</h3>
                <p>Klicke auf das Herz bei einem Rezept, um es hier zu sehen!</p>
              </IonText>
            </div>
          ) : (
            <div className="favorites-grid">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard
                  id={recipe.id}
                  key={recipe.id}
                  title={recipe.title}
                  imageUrl={recipe.imageUrl ?? ''}
                  duration={recipe.preparationTime}
                  difficulty="Einfach"
                  category={recipe.category}
                  rating={recipe.rating}
                  to={`/recipes/${recipe.id}`}
                  isFavorite={true}
                  onFavoriteToggle={() => setRecipeToRemove(recipe)}
                />
              ))}
            </div>
          )}

          {/* Confirmation alert when the user tries to remove a recipe from favorites. */ }
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
        </main>
      </IonContent>
    </IonPage>
  );
}
