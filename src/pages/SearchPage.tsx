import {
    IonContent,
    IonHeader,
    IonPage,
    IonSearchbar,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
} from '@ionic/react';

import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import CategoryChip from '../components/CategoryChip';
import { mockRecipes } from '../data/mockRecipes';



export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [searchMode, setSearchMode] = useState<'recipes' | 'ingredients'>('recipes');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Combine text search and category filtering before rendering the result cards.
    const filteredRecipes = mockRecipes.filter((recipe) => {
        const matchesSearch =
            query === '' ||
            (searchMode === 'recipes'
                ? recipe.title.toLowerCase().includes(query.toLowerCase())
                : recipe.ingredients.some((ingredient) =>
                    ingredient.toLowerCase().includes(query.toLowerCase())
                ));

        const matchesCategory =
            selectedCategory === null || recipe.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const ingredientSuggestions = [
        { label: 'Tomaten', emoji: '🍅' },
        { label: 'Basilikum', emoji: '☘️' },
        { label: 'Mozzarella', emoji: '🧀' },
        { label: 'Hähnchen', emoji: '🍗' },
        { label: 'Avocado', emoji: '🥑' },
        { label: 'Zucchini', emoji: '🥒' },
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Suche</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonSegment
                    value={searchMode}
                    onIonChange={(e) =>
                        setSearchMode(e.detail.value as 'recipes' | 'ingredients')
                    }
                >
                    <IonSegmentButton value="recipes">
                        <IonLabel>Rezepte</IonLabel>
                    </IonSegmentButton>

                    <IonSegmentButton value="ingredients">
                        <IonLabel>Zutaten</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                <IonSearchbar
                    placeholder={
                        searchMode === 'recipes'
                            ? 'Nach Rezepten suchen'
                            : 'Nach Zutaten suchen'
                    }
                    value={query}
                    onIonInput={(e) => setQuery(e.detail.value ?? '')}
                />

                {searchMode === 'ingredients' && (
                    <>
                        <h2>Nach Zutaten suchen</h2>

                        <div className="ingredient-grid">
                            {ingredientSuggestions.map((ingredient) => (
                                <button
                                    key={ingredient.label}
                                    className="ingredient-item"
                                    onClick={() => setQuery(ingredient.label)}
                                >
                                    <div className="ingredient-icon">{ingredient.emoji}</div>
                                    <span>{ingredient.label}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
                <h2>Kategorien</h2>

                <div className="category-grid">
                    <button className="category-item" onClick={() => setSelectedCategory('Vegan')}>
                        <div className="category-icon">🌿</div>
                        <span>Vegan</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Vegetarisch')}>
                        <div className="category-icon">🥬</div>
                        <span>Vegetarisch</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Dessert')}>
                        <div className="category-icon">🧁</div>
                        <span>Desserts</span>
                    </button>

                    <button className="category-item" onClick={() => setSelectedCategory('Schnell')}>
                        <div className="category-icon">⚡</div>
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

                <h2>Suchergebnisse</h2>

                {/* Search results use the same clickable recipe cards as the home page. */}
                <div className="recipe-grid">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard
                            id={recipe.id}
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
