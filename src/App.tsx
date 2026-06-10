import { IonApp, IonContent, IonPage, setupIonicReact } from '@ionic/react';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <IonPage>
        <IonContent fullscreen>
          <HomePage />
          {/*<FavoritesPage /> */}
        </IonContent>
      </IonPage>
    </IonApp>
  );
}
