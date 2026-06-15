import {
    IonButton,
    IonContent,
    IonPage
} from '@ionic/react';

export default function OnboardingPage() {
    return (
        <IonPage>
            <IonContent className="ion-padding">

                <h1>❤️ Speichere Lieblingsrezepte</h1>

                <p>
                    Erstelle dein eigenes Kochbuch.
                </p>

                <IonButton expand="block" routerLink="/login">
                    Weiter
                </IonButton>

            </IonContent>
        </IonPage>
    );
}