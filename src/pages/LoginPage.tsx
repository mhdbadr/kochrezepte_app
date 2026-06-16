import { IonButton, IonContent, IonPage, IonText } from '@ionic/react';
import PageHeader from '../components/PageHeader';

export default function LoginPage() {
  return (
    <IonPage>
      <PageHeader title="Profil" />

      <IonContent className="ion-padding">
        <main style={{ maxWidth: '560px', margin: '48px auto' }}>
          <IonText>
            <p style={{ color: 'var(--app-primary)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Account
            </p>
            <h1 style={{ marginTop: 0 }}>Profil und Anmeldung</h1>
            <p style={{ color: 'var(--app-muted)', lineHeight: 1.6 }}>
              Diese Seite ist als Einstieg fuer Login und Profil vorbereitet. Die eigentliche Auth-Logik kann hier
              spaeter angeschlossen werden.
            </p>
          </IonText>

          <IonButton routerLink="/home">Zurueck zur Startseite</IonButton>
        </main>
      </IonContent>
    </IonPage>
  );
}
