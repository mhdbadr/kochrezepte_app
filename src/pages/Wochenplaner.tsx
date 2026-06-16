import {
    IonContent,
    IonPage,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
} from '@ionic/react';
import PageHeader from '../components/PageHeader';

export default function PlannerPage() {
    return (
        <IonPage>
            <PageHeader title="Wochenplaner" />

            <IonContent className="ion-padding">

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Montag</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>Noch kein Rezept geplant</IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Dienstag</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>Noch kein Rezept geplant</IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Mittwoch</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>Noch kein Rezept geplant</IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Donnerstag</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>Noch kein Rezept geplant</IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Freitag</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>Noch kein Rezept geplant</IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Samstag</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>Noch kein Rezept geplant</IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Sonntag</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>Noch kein Rezept geplant</IonCardContent>
                </IonCard>

            </IonContent>
        </IonPage>
    );
}
