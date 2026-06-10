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
import { useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination, Autoplay } from 'swiper/modules';

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Kochrezepte</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">

                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000 }}
                    loop={true}
                >
                    <SwiperSlide>
                        <div
                            className="hero-slide"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200')",
                            }}
                        >
                            <div className="hero-overlay">
                                <p>Neue Rezepte</p>
                                <h1>Entdecke neue Lieblingsgerichte</h1>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div
                            className="hero-slide"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200')",
                            }}
                        >
                            <div className="hero-overlay">
                                <p>Desserts</p>
                                <h1>Süße Ideen für jeden Tag</h1>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div
                            className="hero-slide"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200')",
                            }}
                        >
                            <div className="hero-overlay">
                                <p>Vegan</p>
                                <h1>Gesund und lecker kochen</h1>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>

                <IonSearchbar
                    placeholder="Was möchtest du kochen?"
                />

                <h2>Kategorien</h2>

                <div className="chips">
                    <CategoryChip label="Alle" onClick={() => setSelectedCategory(null)} />
                    <CategoryChip label="Pasta" onClick={() => setSelectedCategory('Pasta')} />
                    <CategoryChip label="Vegan" onClick={() => setSelectedCategory('Vegan')} />
                    <CategoryChip label="Dessert" onClick={() => setSelectedCategory('Dessert')} />
                    <CategoryChip label="Frühstück" onClick={() => setSelectedCategory('Frühstück')} />
                </div>

                {selectedCategory && (
                    <p>Ausgewählte Kategorie: {selectedCategory}</p>
                )}

                <h2>Neue Rezepte</h2>

                <div className="recipe-grid">
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
                </div>

                <h2>Beliebte Rezepte</h2>

                <div className="recipe-grid">
                    <RecipeCard
                        title="Caesar Salat"
                        imageUrl="https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800"
                        duration={15}
                        difficulty="Einfach"
                        category="Salat"
                        rating={5}
                    />

                    <RecipeCard
                        title="Chicken Curry"
                        imageUrl="https://img.chefkoch-cdn.de/rezepte/1582261265704130/bilder/1573472/crop-960x540/chicken-curry.jpg"
                        duration={40}
                        difficulty="Mittel"
                        category="Asiatisch"
                        rating={4}
                    />
                </div>

            </IonContent>
        </IonPage>
    );
}