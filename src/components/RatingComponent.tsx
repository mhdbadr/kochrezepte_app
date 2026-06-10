import React, { useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';

interface RatingComponentProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

const RatingComponent: React.FC<RatingComponentProps> = ({ 
  initialRating = 0, 
  onRatingChange 
}) => {
 
  const [rating, setRating] = useState<number>(initialRating);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
    if (onRatingChange) {
      onRatingChange(selectedRating); 
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <IonButton 
          key={starNumber} 
          fill="clear" 
          size="small"
          onClick={() => handleStarClick(starNumber)}
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