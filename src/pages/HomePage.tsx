import { IonContent, IonPage,IonSearchbar } from '@ionic/react';


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

const categories: Array<{ label: string; value: Recipe['category']; icon: string }> = [
    { label: 'Vegan', value: 'Vegan', icon: '🌿' },
    { label: 'Vegetarisch', value: 'Vegetarisch', icon: '🥬' },
    { label: 'Dessert', value: 'Dessert', icon: '🧁' },
    { label: 'Schnell', value: 'Schnell', icon: '⚡' },
    { label: 'Pasta', value: 'Pasta', icon: '🍕' },
    { label: 'Hauptgericht', value: 'Hauptgericht', icon: '🍜' },
    { label: 'Gesund', value: 'Gesund', icon: '🥗' },
];

export default function HomePage() {
    const history = useHistory();
    // Local state for recipes, selected category, loading status, and error messages.
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Recipe['category'] | null>(null);
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
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            className={
                                selectedCategory === category.value
                                    ? 'category-item category-item--selected'
                                    : 'category-item'
                            }
                            onClick={() => setSelectedCategory(category.value)}
                        >
                            <div className="category-icon">{category.icon}</div>
                            <span>{category.label}</span>
                        </button>
                    ))}

                    <button
                        className={
                            selectedCategory === null
                                ? 'category-item category-item--selected'
                                : 'category-item'
                        }
                        onClick={() => setSelectedCategory(null)}
                    >
                        <div className="category-icon">🍽️</div>
                        <span>Alle</span>
                    </button>
                </div>

                {selectedCategory && (
                    <p>
                        Ausgewählte Kategorie:{' '}
                        {categories.find((category) => category.value === selectedCategory)?.label}
                    </p>
                )}

                <h2>Rezepte</h2>

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
