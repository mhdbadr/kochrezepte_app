import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar
} from '@ionic/react';

import {
    leafOutline,
    flashOutline,
} from 'ionicons/icons';

import { IonIcon } from '@ionic/react';
import { mockRecipes } from '../data/mockRecipes';

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

    const filteredRecipes =
        selectedCategory === null
            ? mockRecipes
            : mockRecipes.filter((recipe) => recipe.category === selectedCategory);
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

                <div className="category-grid">
                    <button
                        className="category-item"
                        onClick={() => setSelectedCategory('Vegan')}
                    >
                        <div className="category-icon">
                            <IonIcon icon={leafOutline} />
                        </div>
                        <span>Vegan</span>
                    </button>

                    <button
                        className="category-item"
                        onClick={() => setSelectedCategory('Vegetarisch')}
                    >
                        <div className="category-icon">
                            <IonIcon icon={leafOutline} />
                        </div>
                        <span>Vegetarisch</span>
                    </button>

                    <button
                        className="category-item"
                        onClick={() => setSelectedCategory('Dessert')}
                    >
                        <div className="category-icon">
                            🧁
                        </div>
                        <span>Desserts</span>
                    </button>

                    <button
                        className="category-item"
                        onClick={() => setSelectedCategory('Schnell')}
                    >
                        <div className="category-icon">
                            <IonIcon icon={flashOutline} />
                        </div>
                        <span>Schnell</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Pizza')}>
                        <div className="category-icon">🍕</div>
                        <span>Pizza</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Salat')}>
                        <div className="category-icon">🥗</div>
                        <span>Salat</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Asiatisch')}>
                        <div className="category-icon">🍜</div>
                        <span>Asiatisch</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Frühstück')}>
                        <div className="category-icon">🥐</div>
                        <span>Frühstück</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Getränke')}>
                        <div className="category-icon">🥤</div>
                        <span>Getränke</span>
                    </button>
                    <button className="category-item" onClick={() => setSelectedCategory(null)}>
                        <div className="category-icon">🍽️</div>
                        <span>Alle</span>
                    </button>


                </div>

                {selectedCategory && (
                    <p>Ausgewählte Kategorie: {selectedCategory}</p>
                )}

                <h2>Neue Rezepte</h2>

                <div className="recipe-grid">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.title}
                            title={recipe.title}
                            imageUrl={recipe.imageUrl}
                            duration={recipe.duration}
                            difficulty={recipe.difficulty}
                            category={recipe.category}
                            rating={recipe.rating}
                        />
                    ))}
                </div>




            </IonContent>
        </IonPage>
    );
}