import {
    IonButton,
    IonContent,
    IonPage
} from '@ionic/react';
import welcomeImage from '../assets/1bild.png';
import './WelcomePage.css';
export default function WelcomePage() {
    return (
        <IonPage>
            <IonContent fullscreen>
                <section
                    className="welcome-hero"
                    style={{ backgroundImage: `url(${welcomeImage})` }}
                >
                    <div className="welcome-overlay">
                        <h1>Kochrezepte</h1>

                        <h2>
                            Rezepte für Anfänger
                            <br />
                            und Profis
                        </h2>

                        <p>
                            Entdecke leckere Gerichte
                            <br />
                            und plane deine Woche.
                        </p>

                        <IonButton expand="block" routerLink="/onboarding">
                            Los geht&apos;s
                        </IonButton>
                    </div>
                </section>
            </IonContent>
        </IonPage>
    );
}