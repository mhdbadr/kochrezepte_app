import {
    IonContent,
    IonLabel,
    IonPage,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonText,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import RecipeCard from '../components/RecipeCard';
import type { Recipe } from '../models/Recipe';
import { getAllRecipes } from '../repositories/recipeRepository';
import './HomePage.css';
import './SearchPage.css';

const ingredientSynonyms: Record<string, string[]> = {
    tomate: ['tomate', 'tomaten', 'tomato', 'tomatoes', 'toma'],
    basilikum: ['basilikum', 'basil', 'basilic'],
    mozzarella: ['mozzarella', 'käse', 'kaese', 'cheese', 'kase'],
    haehnchen: ['hähnchen', 'haehnchen', 'huhn', 'chicken'],
    avocado: ['avocado'],
    zucchini: ['zucchini', 'courgette'],
};

function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss');
}

function normalizeIngredient(input: string): string {
    const value = normalizeText(input);

    for (const [key, words] of Object.entries(ingredientSynonyms)) {
        if (words.some((word) => normalizeText(word).includes(value) || value.includes(normalizeText(word)))) {
            return key;
        }
    }

    return value;
}

function getIngredientText(ingredient: string | { name: string }): string {
    return typeof ingredient === 'string' ? ingredient : ingredient.name;
}

export default function SearchPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [query, setQuery] = useState('');
    const [searchMode, setSearchMode] = useState<'recipes' | 'ingredients'>('recipes');
    const [selectedCategory, setSelectedCategory] = useState<Recipe['category'] | null>(null);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function loadRecipes() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const recipesFromSupabase = await getAllRecipes();
                setRecipes(recipesFromSupabase);
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : 'Recipes could not be loaded.');
            } finally {
                setIsLoading(false);
            }
        }

        loadRecipes();
    }, []);

    const categories: Array<{ label: string; value: Recipe['category']; icon: string }> = [
        { label: 'Vegan', value: 'Vegan', icon: '🌿' },
        { label: 'Vegetarisch', value: 'Vegetarian', icon: '🥬' },
        { label: 'Dessert', value: 'Dessert', icon: '🧁' },
        { label: 'Schnell', value: 'Quick', icon: '⚡' },
        { label: 'Pasta', value: 'Pasta', icon: '🍕' },
        { label: 'Hauptgericht', value: 'Main Dish', icon: '🍜' },
        { label: 'Gesund', value: 'Healthy', icon: '🥗' },
    ];

    const ingredientSuggestions = [
        { label: 'Tomaten', value: 'tomate', icon: '🍅' },
        { label: 'Basilikum', value: 'basilikum', icon: '☘️' },
        { label: 'Mozzarella', value: 'mozzarella', icon: '🧀' },
        { label: 'Haehnchen', value: 'haehnchen', icon: '🍗' },
        { label: 'Avocado', value: 'avocado', icon: '🥑' },
        { label: 'Zucchini', value: 'zucchini', icon: '🥒' },
    ];

    function toggleIngredient(ingredient: string) {
        setSelectedIngredients((current) =>
            current.includes(ingredient)
                ? current.filter((item) => item !== ingredient)
                : [...current, ingredient]
        );
    }

    const filteredRecipes = recipes.filter((recipe) => {
        const lowerQuery = normalizeText(query);
        const normalizedQueryIngredient = normalizeIngredient(query);

        const recipeIngredients = recipe.ingredients.map((ingredient) =>
            normalizeIngredient(getIngredientText(ingredient))
        );

        const matchesRecipeSearch =
            query === '' ||
            normalizeText(recipe.title).includes(lowerQuery) ||
            normalizeText(recipe.description).includes(lowerQuery);

        const matchesIngredientSearch =
            query === '' ||
            recipeIngredients.some((ingredient) =>
                ingredient.includes(normalizedQueryIngredient)
            );

        const matchesSearch =
            searchMode === 'recipes' ? matchesRecipeSearch : matchesIngredientSearch;

        const matchesSelectedIngredients =
            selectedIngredients.length === 0 ||
            selectedIngredients.every((ingredient) =>
                recipeIngredients.includes(ingredient)
            );

        const matchesCategory =
            selectedCategory === null || recipe.category === selectedCategory;

        return matchesSearch && matchesSelectedIngredients && matchesCategory;
    });

    return (
        <IonPage>
            <PageHeader title="Suche" />

            <IonContent className="ion-padding">
                <main className="search-page">
                    <IonSegment
                        className="search-mode"
                        value={searchMode}
                        onIonChange={(event) => setSearchMode(event.detail.value as 'recipes' | 'ingredients')}
                    >
                        <IonSegmentButton value="recipes">
                            <IonLabel>Rezepte</IonLabel>
                        </IonSegmentButton>

                        <IonSegmentButton value="ingredients">
                            <IonLabel>Zutaten</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    <IonSearchbar
                        className="search-input"
                        placeholder={searchMode === 'recipes' ? 'Nach Rezepten suchen' : 'Nach Zutaten suchen'}
                        value={query}
                        onIonInput={(event) => setQuery(event.detail.value ?? '')}
                    />

                    {searchMode === 'ingredients' && (
                        <>
                            <h2 className="search-section-title">Nach Zutaten suchen</h2>

                            <div className="ingredient-grid">
                                {ingredientSuggestions.map((ingredient) => (
                                    <button
                                        key={ingredient.value}
                                        className={
                                            selectedIngredients.includes(ingredient.value)
                                                ? 'ingredient-item ingredient-item--selected'
                                                : 'ingredient-item'
                                        }
                                        onClick={() => toggleIngredient(ingredient.value)}
                                    >
                                        <div className="ingredient-icon">{ingredient.icon}</div>
                                        <span>{ingredient.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <h2 className="search-section-title">Kategorien</h2>

                    <div className="category-grid">
                        {categories.map((category) => (
                            <button
                                className={
                                    selectedCategory === category.value
                                        ? 'category-item category-item--selected'
                                        : 'category-item'
                                }
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                            >
                                <div className="category-icon">{category.icon}</div>
                                <span>{category.label}</span>
                            </button>
                        ))}

                        <button
                            className={selectedCategory === null ? 'category-item category-item--selected' : 'category-item'}
                            onClick={() => setSelectedCategory(null)}
                        >
                            <div className="category-icon">🍽️</div>
                            <span>Alle</span>
                        </button>
                    </div>

                    <h2 className="search-section-title">Suchergebnisse</h2>

                    {isLoading && (
                        <IonText color="medium">
                            <p>Rezepte werden geladen...</p>
                        </IonText>
                    )}

                    {errorMessage && (
                        <IonText color="danger">
                            <p>{errorMessage}</p>
                        </IonText>
                    )}

                    {!isLoading && !errorMessage && filteredRecipes.length === 0 && (
                        <IonText color="medium">
                            <p>Keine Rezepte gefunden.</p>
                        </IonText>
                    )}

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
                </main>
            </IonContent>
        </IonPage>
    );
}