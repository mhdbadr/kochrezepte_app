import {
    IonButton,
    IonContent,
    IonPage
} from '@ionic/react';

export default function WelcomePage() {
    return (
        <IonPage>
            <IonContent className="ion-padding">

                <h1>🍳 Kochrezepte</h1>

                <h2>Über 1000 Rezepte für Anfänger bis Profis</h2>

                <p>
                    Entdecke leckere Gerichte und plane deine Woche.
                </p>

                <IonButton expand="block" routerLink="/onboarding">
                    Los geht's
                </IonButton>

            </IonContent>
        </IonPage>
    );
}