import React, { useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { heart, heartOutline } from 'ionicons/icons';
import { useFavorites } from '../hooks/useFavorites';

interface FavoriteButtonProps {
 recipeId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ recipeId }) => {

  const {isFavorite, toggleFavorite} = useFavorites();

  const isFav = isFavorite(recipeId);
  

  return (
    <IonButton fill="clear" onClick={() => toggleFavorite(recipeId)}>
      <IonIcon
        icon={isFav ? heart : heartOutline}
        color={isFav ? 'danger' : 'medium'}
        slot="icon-only"
      />
    </IonButton>
  );
};

export default FavoriteButton;