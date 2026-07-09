import React, { useState } from 'react';
import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import { isGuest } from '../utils/auth';
interface RatingComponentProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

/**
 * RatingComponent
 * Renders a interactive 5-star rating bar.
 * Prevents guest users from voting and allows users to increase or decrease the score.
 */
const RatingComponent: React.FC<RatingComponentProps> = ({ 
  initialRating = 0, 
  onRatingChange 
}) => {
 
  const [rating, setRating] = useState<number>(initialRating);
  const [present] = useIonToast();
  /**
     * Handles clicks on individual stars to update the score.
     * Blocks action for guest users. Includes a toggle mechanic to decrease the rating 
     * if the user clicks on the current or a lower rating star.
     * * @param e The mouse event to stop propagation
     * @param selectedRating The star number that was clicked (1-5)
     */
  const handleStarClick = (e: React.MouseEvent, selectedRating: number) => {
    e.preventDefault();
    e.stopPropagation();

    // Block guests from rating and show a warning toast
    if (isGuest()) {
      present('Bitte melde dich an, um Rezepte zu bewerten.', 2000);
      return;
    }



    let newRating = selectedRating;
    
    // Toggle logic: If the user clicks on an already selected star level, reduce it by 1
    if (selectedRating <= rating) {
      newRating = selectedRating - 1;
    }

    setRating(newRating);

    if (onRatingChange) {
      onRatingChange(newRating); 
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <IonButton 
          key={starNumber} 
          fill="clear" 
          size="small"
          onClick={(e) => handleStarClick(e,starNumber)}
          style={{ '--padding-start': '0', '--padding-end': '0', margin: '0' }}
        >
          <IonIcon
            icon={starNumber <= rating ? star : starOutline}
            color={starNumber <= rating ? 'warning' : 'medium'}
            style={{ fontSize: '1.8rem' }}
          />
        </IonButton>
      ))}
    </div>
  );
};

export default RatingComponent;