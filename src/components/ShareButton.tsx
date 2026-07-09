import { IonButton, IonIcon } from '@ionic/react';
import { shareOutline } from 'ionicons/icons';

interface ShareButtonProps {
  recipeTitle: string;
  recipeId: string;
}

/**
 * ShareButton Component
 * Uses the native Web Share API to share a recipe link on mobile devices.
 * If the browser doesn't support native sharing, it falls back to copying
 * the link to the clipboard and shows an elegant toast notification.
 */
export default function ShareButton({ recipeTitle, recipeId }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/recipes/${recipeId}`;
    const shareText = `Schau dir dieses leckere Rezept für "${recipeTitle}" an!\n${shareUrl}`;

    // Try using the device's native sharing sheet (Mobile Safari/Chrome)
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
    
    // Fallback: Copy to clipboard if native sharing is unavailable
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