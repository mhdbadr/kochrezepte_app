import { IonApp, IonContent, IonPage, setupIonicReact } from '@ionic/react';
import HomePage from './pages/HomePage';

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <IonPage>
        <IonContent fullscreen>
          <HomePage />
        </IonContent>
      </IonPage>
    </IonApp>
  );
}
