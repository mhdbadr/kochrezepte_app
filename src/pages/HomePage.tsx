import { IonContent, IonIcon, IonPage, IonSearchbar ,useIonViewWillEnter} from '@ionic/react';

// Importing icons for the category buttons from Ionicons.
import {
    appsOutline,
    flashOutline,
    iceCreamOutline,
    leafOutline,
    nutritionOutline,
    pizzaOutline,
    restaurantOutline,
} from 'ionicons/icons';

import { useEffect, useState } from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import RecipeCard from '../components/RecipeCard';
import PageHeader from '../components/PageHeader';
import type { Recipe } from '../models/Recipe';
import { getAllRecipes } from '../repositories/recipeRepository';
import './HomePage.css';
import { useHistory } from 'react-router-dom';


import 'swiper/css';
import 'swiper/css/pagination';

export default function HomePage() {
    const history = useHistory();
    // Local state for recipes, selected category, loading status, and error messages.
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let isPageActive = true;

        async function loadRecipes() {
            try {
                // Load recipes from Supabase through the repository layer.
                setIsLoading(true);
                const loadedRecipes = await getAllRecipes();

                if (isPageActive) {
                    setRecipes(loadedRecipes);
                    setErrorMessage("");
                }
            } catch (error) {
                if (isPageActive) {
                    setErrorMessage(error instanceof Error ? error.message : "Recipes could not be loaded.");
                }
            } finally {
                if (isPageActive) {
                    setIsLoading(false);
                }
            }
        }

        loadRecipes();

        return () => {
            isPageActive = false;
        };
    }, []);

    // Filter loaded recipes locally by category.
    const filteredRecipes =
        selectedCategory === null
            ? recipes
            : recipes.filter((recipe) => recipe.category === selectedCategory);

    return (
        <IonPage>
            <PageHeader title="Kochrezepte" />

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

                    <IonSearchbar 
                        placeholder="Was moechtest du kochen?" 
                        onIonFocus={() => history.push('/search')}
                    />

                <h2>Kategorien</h2>

                {/* Category buttons update the local filter without leaving the home page. */}
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

                {selectedCategory && (
                    <p>Ausgewaehlte Kategorie: {selectedCategory}</p>
                )}

                <h2>Neue Rezepte</h2>

                {isLoading && <p>Rezepte werden geladen...</p>}
                {errorMessage && <p>Supabase error: {errorMessage}</p>}
                {!isLoading && !errorMessage && filteredRecipes.length === 0 && (
                    <p>Keine Rezepte gefunden.</p>
                )}

                {/* Recipe cards link directly to the detail page for the selected recipe. */}
                <div className="recipe-grid">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard
                            id={recipe.id}
                            key={recipe.id}
                            title={recipe.title}
                            imageUrl={recipe.imageUrl ?? ''}
                            duration={recipe.preparationTime}
                            difficulty={recipe.difficulty}
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
