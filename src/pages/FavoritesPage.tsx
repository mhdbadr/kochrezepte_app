import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
} from '@ionic/react';

const FavoritesPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Merkzettel</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                Favorites Page
            </IonContent>
        </IonPage>
    );
};

export default FavoritesPage;