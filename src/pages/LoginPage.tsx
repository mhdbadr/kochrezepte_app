import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';

export default function LoginPage() {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Anmelden</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">

                <IonItem>
                    <IonInput
                        label="E-Mail"
                        type="email"
                        placeholder="name@email.de"
                    />
                </IonItem>

                <IonItem>
                    <IonInput
                        label="Passwort"
                        type="password"
                    />
                </IonItem>

                <IonButton expand="block">
                    Anmelden
                </IonButton>

                <IonButton expand="block" fill="clear" routerLink="/register">
                    Registrieren
                </IonButton>

                <IonButton fill="clear" color="medium" routerLink="/home">
                    Als Gast fortfahren
                </IonButton>

                <p className="guest-info">
                    Mit einem Gastkonto stehen nur eingeschränkte Funktionen zur Verfügung.
                </p>

            </IonContent>
        </IonPage>
    );
}