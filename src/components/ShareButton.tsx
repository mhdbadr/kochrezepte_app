import { IonButton, IonIcon } from '@ionic/react';
import { shareOutline } from 'ionicons/icons';
import { Share } from '@capacitor/share';

interface ShareButtonProps {
  recipeTitle: string;
  recipeId: string;
}

/**
 * ShareButton Component
 * Uses the Capacitor Share plugin to share a recipe link on mobile devices.
 */
export default function ShareButton({ recipeTitle, recipeId }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/recipes/${recipeId}`;
   
       try {
        await Share.share({
          title: recipeTitle,
          text: `Schau dir dieses leckere Rezept für "${recipeTitle}" an!`,
          url: shareUrl,
         dialogTitle: 'Rezept mit Freunden teilen',
        });
      } catch (error) {
        console.log('Teilen fehlgeschlagen:', error);
      }

      return;
  };

  return (
    <IonButton fill="clear" onClick={handleShare}>
      <IonIcon slot="icon-only" icon={shareOutline} color="primary" />
    </IonButton>
  );
}