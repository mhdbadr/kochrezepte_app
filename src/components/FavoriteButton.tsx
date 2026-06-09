import React, { useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { heart, heartOutline } from 'ionicons/icons';

interface FavoriteButtonProps {
  initialIsFavorite?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ initialIsFavorite = false }) => {

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <IonButton fill="clear" onClick={toggleFavorite}>
      <IonIcon
        icon={isFavorite ? heart : heartOutline}
        color={isFavorite ? 'danger' : 'medium'}
        slot="icon-only"
      />
    </IonButton>
  );
};

export default FavoriteButton;