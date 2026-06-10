import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonText 
} from '@ionic/react';
import { useFavorites } from '../hooks/useFavorites';
import { mockRecipes } from '../data/mockRecipes';
import FavoriteButton from '../components/FavoriteButton';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const favoriteRecipes = mockRecipes.filter(recipe => favorites.includes(recipe.id));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Meine Favoriten</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        {favoriteRecipes.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <IonText color="medium">
              <h3>Du hast noch keine Favoriten gespeichert.</h3>
              <p>Klicke auf das Herz bei einem Rezept, um es hier zu sehen!</p>
            </IonText>
          </div>
        ) : (
        
          <IonList>
            {favoriteRecipes.map(recipe => (
              <IonItem key={recipe.id}>
                <IonLabel>
                  <h2>{recipe.title}</h2>
                </IonLabel>
                <FavoriteButton recipeId={recipe.id} />
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}