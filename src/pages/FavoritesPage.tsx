import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
} from '@ionic/react';

export default function FavoritesPage() {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Kochbuch</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Meine Favoriten</IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent>
                        Du hast noch keine Rezepte gespeichert.
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}