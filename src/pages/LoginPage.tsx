import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonPage,
} from '@ionic/react';
import PageHeader from '../components/PageHeader';

export default function LoginPage() {
    return (
        <IonPage>
            <PageHeader title="Profil" />

            <IonContent className="ion-padding">
                <main style={{ maxWidth: '560px', margin: '48px auto' }}>
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

                    <IonButton expand="block" fill="clear" color="medium" routerLink="/home">
                        Als Gast fortfahren
                    </IonButton>

                    <p>
                        Mit einem Gastkonto stehen nur eingeschränkte Funktionen zur Verfügung.
                    </p>
                </main>
            </IonContent>
        </IonPage>
    );
}