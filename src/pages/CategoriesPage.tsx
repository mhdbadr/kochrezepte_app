import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
} from '@ionic/react';

const CategoriesPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Kategorien</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent classNam    e="ion-padding">
                CategoriesPage
            </IonContent>
        </IonPage>
    );
};

export default CategoriesPage;