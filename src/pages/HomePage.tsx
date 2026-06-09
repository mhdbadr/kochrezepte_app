import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar
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

                <IonSearchbar
                    placeholder="Was möchtest du kochen?"
                ></IonSearchbar>


                <h2>Kategorien</h2>

                <div className="chips">
                    <CategoryChip label="Pasta" />
                    <CategoryChip label="Vegan" />
                    <CategoryChip label="Dessert" />
                    <CategoryChip label="Frühstück" />
                </div>


                <h2>Neue Rezepte</h2>

                <RecipeCard
                    title="Pasta Carbonara"
                    imageUrl="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800"
                    duration={25}
                    difficulty="Einfach"
                    category="Pasta"
                    rating={5}
                />

                <RecipeCard
                    title="Pizza Margherita"
                    imageUrl="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800"
                    duration={30}
                    difficulty="Mittel"
                    category="Pizza"
                    rating={4}
                />

                <h2>Beliebte Rezepte</h2>

                <RecipeCard
                    title="Caesar Salat"
                    imageUrl="https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800"
                    duration={15}
                    difficulty="Einfach"
                    category="Salat"
                    rating={5}
                />


            </IonContent>
        </IonPage>
    );
}