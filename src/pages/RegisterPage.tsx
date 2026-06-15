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

export default function RegisterPage() {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Registrieren</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">

                <IonItem>
                    <IonInput
                        label="Name"
                        placeholder="Dein Name"
                    />
                </IonItem>

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

                <IonItem>
                    <IonInput
                        label="Passwort wiederholen"
                        type="password"
                    />
                </IonItem>

                <IonButton expand="block">
                    Registrieren
                </IonButton>

                <IonButton expand="block" fill="clear" routerLink="/login">
                    Bereits ein Konto? Anmelden
                </IonButton>

            </IonContent>
        </IonPage>
    );
}