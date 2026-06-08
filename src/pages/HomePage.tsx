import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <main className="home-page">
          <section className="home-card">
            <p className="home-label">Kochrezepte App</p>
            <h1>Basic App Structure</h1>
            <p className="home-text">
              This is the initial project foundation. Features will be implemented in separate issues.
            </p>
            <Link to="/recipes">Rezepte anzeigen</Link>
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
}
