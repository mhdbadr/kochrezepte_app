import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
} from '@ionic/react';

const SearchPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Suche</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                Search Page
            </IonContent>
        </IonPage>
    );
};

export default SearchPage;