import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react';

import './HomePage.css';

export default function HomePage() {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Kochrezepte</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <main className="home-page">
                    <section className="home-card">
                        <p className="home-label">Kochrezepte App</p>
                        <h1>Basic App Structure</h1>
                        <p className="home-text">
                            This is the initial project foundation. Features will be implemented in separate issues.
                        </p>
                    </section>
                </main>
            </IonContent>
        </IonPage>
    );
}