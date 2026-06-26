import { IonButton, IonIcon } from '@ionic/react';
import { shareOutline } from 'ionicons/icons';

interface ShareButtonProps {
  recipeTitle: string;
  recipeId: string;
}

export default function ShareButton({ recipeTitle, recipeId }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/recipes/${recipeId}`;
    const shareText = `Schau dir dieses leckere Rezept für "${recipeTitle}" an!\n${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipeTitle,
          text: shareText,
        });
      } catch (error) {
        console.log('Teilen fehlgeschlagen:', error);
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      alert('Teilen-Link wurde in die Zwischenablage kopiert!');
    } catch (error) {
      console.error('Fehler beim Kopieren des Links:', error);
    }
  };

  return (
    <IonButton fill="clear" onClick={handleShare}>
      <IonIcon slot="icon-only" icon={shareOutline} color="primary" />
    </IonButton>
  );
}