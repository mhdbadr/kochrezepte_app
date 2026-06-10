import {
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonSearchbar,
    IonTitle,
    IonToolbar
} from '@ionic/react';

import {
    appsOutline,
    flashOutline,
    iceCreamOutline,
    leafOutline,
    nutritionOutline,
    pizzaOutline,
    restaurantOutline,
} from 'ionicons/icons';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import CategoryChip from '../components/CategoryChip';
import RecipeCard from '../components/RecipeCard';
import { mockRecipes } from '../data/mockRecipes';
import './HomePage.css';

import 'swiper/css';
import 'swiper/css/pagination';

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
                                <h1>Suesse Ideen fuer jeden Tag</h1>
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

                <IonSearchbar placeholder="Was moechtest du kochen?" />

                <h2>Kategorien</h2>

                <div className="category-grid">
                    <button className="category-item" onClick={() => setSelectedCategory('Vegan')}>
                        <div className="category-icon">
                            <IonIcon icon={leafOutline} />
                        </div>
                        <span>Vegan</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Vegetarian')}>
                        <div className="category-icon">
                            <IonIcon icon={leafOutline} />
                        </div>
                        <span>Vegetarisch</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Dessert')}>
                        <div className="category-icon">
                            <IonIcon icon={iceCreamOutline} />
                        </div>
                        <span>Desserts</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Quick')}>
                        <div className="category-icon">
                            <IonIcon icon={flashOutline} />
                        </div>
                        <span>Schnell</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Pasta')}>
                        <div className="category-icon">
                            <IonIcon icon={pizzaOutline} />
                        </div>
                        <span>Pasta</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Healthy')}>
                        <div className="category-icon">
                            <IonIcon icon={nutritionOutline} />
                        </div>
                        <span>Gesund</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Main Dish')}>
                        <div className="category-icon">
                            <IonIcon icon={restaurantOutline} />
                        </div>
                        <span>Hauptgericht</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory(null)}>
                        <div className="category-icon">
                            <IonIcon icon={appsOutline} />
                        </div>
                        <span>Alle</span>
                    </button>
                </div>

                <div className="chips">
                    <CategoryChip label="Alle Rezepte" onClick={() => setSelectedCategory(null)} />
                    <CategoryChip label="Zur Rezeptliste" onClick={() => undefined} />
                    <Link to="/recipes">Rezepte verwalten</Link>
                </div>

                {selectedCategory && (
                    <p>Ausgewaehlte Kategorie: {selectedCategory}</p>
                )}

                <h2>Neue Rezepte</h2>

                <div className="recipe-grid">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            title={recipe.title}
                            imageUrl={recipe.imageUrl ?? ''}
                            duration={recipe.preparationTime}
                            difficulty="Einfach"
                            category={recipe.category}
                            rating={recipe.rating}
                            to={`/recipes/${recipe.id}`}
                        />
                    ))}
                </div>
            </IonContent>
        </IonPage>
    );
}
