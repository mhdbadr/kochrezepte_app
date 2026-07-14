import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { heart, heartOutline } from 'ionicons/icons';
import { useFavorites } from '../hooks/useFavorites';
import { isGuest } from '../utils/auth';
import { useFeedbackToast } from '../hooks/useFeedbackToast';

interface FavoriteButtonProps {
  recipeId: string;
  isFavoriteOverride?: boolean; // flag to override the favorite status
  onToggle?: (recipeId: string) => void; // callback to trigger before toggling the favorite status
}

// renders a heart icon button that indicates whether the recipe is a favorite and allows toggling the favorite status
const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  recipeId,
  isFavoriteOverride,
  onToggle,
}) => {

  const {isFavorite, toggleFavorite} = useFavorites();

  // get the favorite status, using the override if provided
  const isFav = isFavoriteOverride ?? isFavorite(recipeId);

  const { showValidationToast } = useFeedbackToast();
  // handle the button click to toggle the favorite status
  function handleToggleFavorite() {
    if (isGuest()) {
      showValidationToast('Bitte melde dich an, um Favoriten zu speichern.');
      return;
    }
    if (onToggle) {
      onToggle(recipeId);
      return;
    }

    toggleFavorite(recipeId);
  }

  return (
    <IonButton fill="clear" onClick={handleToggleFavorite}>
      <IonIcon
        icon={isFav ? heart : heartOutline}
        color={isFav ? 'danger' : 'medium'}
        slot="icon-only"
      />
    </IonButton>
  );
};

export default FavoriteButton;
