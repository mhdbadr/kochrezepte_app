import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react';

import './HomePage.css';
import RecipeCard from '../components/RecipeCard';
import CategoryChip from '../components/CategoryChip';

export default function HomePage() {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Kochrezepte</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>


                <RecipeCard
                    title="Pasta Carbonara"
                    imageUrl="https://fivi.gg/cdn/shop/articles/auberginen_pasta_rezeptbild_v1_1200x.jpg?v=1753447615"
                    duration={25}
                    difficulty="Einfach"
                    category="Pasta"
                    rating={5}
                />



                <div className="chips">
                    <CategoryChip label="Pasta" />
                    <CategoryChip label="Vegan" />
                    <CategoryChip label="Dessert" />
                    <CategoryChip label="Frühstück" />
                </div>

            </IonContent>
        </IonPage>
    );
}