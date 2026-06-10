import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { shareOutline } from 'ionicons/icons';

interface ShareButtonProps {
  recipeTitle: string;
  recipeId: string;
}

export default function ShareButton({ recipeTitle, recipeId }: ShareButtonProps) {
  
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/recipe/${recipeId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipeTitle,
          text: `Schau dir dieses leckere Rezept für "${recipeTitle}" an!`,
          url: shareUrl,
        });
        console.log('Erfolgreich geteilt!');
      } catch (error) {
        console.log('Teilen fehlgeschlagen:', error);
      }
    } else {
    
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Teilen-Link wurde in die Zwischenablage kopiert!');
      } catch (err) {
        console.error('Fehler beim Kopieren des Links:', err);
      }
    }
  };

  return (
    <IonButton fill="clear" onClick={handleShare}>
      <IonIcon slot="icon-only" icon={shareOutline} color="primary" />
    </IonButton>
  );
}