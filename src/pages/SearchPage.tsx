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

const recipes = [
    {
        title: 'Pasta Carbonara',
        imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800',
        duration: 25,
        difficulty: 'Einfach',
        category: 'Pasta',
        rating: 5,
        ingredients: ['nudeln', 'ei', 'käse'],
    },
    {
        title: 'Pizza Margherita',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
        duration: 30,
        difficulty: 'Mittel',
        category: 'Pizza',
        rating: 4,
        ingredients: ['teig', 'tomaten', 'mozzarella'],
    },
    {
        title: 'Caesar Salat',
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
        duration: 15,
        difficulty: 'Einfach',
        category: 'Salat',
        rating: 5,
        ingredients: ['salat', 'hähnchen', 'parmesan'],
    },
];

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [searchMode, setSearchMode] = useState<'recipes' | 'ingredients'>('recipes');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredRecipes = recipes.filter((recipe) => {
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

                <h2>Kategorien</h2>

                <div className="chips">
                    <CategoryChip label="Alle" onClick={() => setSelectedCategory(null)} />
                    <CategoryChip label="Pasta" onClick={() => setSelectedCategory('Pasta')} />
                    <CategoryChip label="Pizza" onClick={() => setSelectedCategory('Pizza')} />
                    <CategoryChip label="Salat" onClick={() => setSelectedCategory('Salat')} />
                </div>

                <h2>Suchergebnisse</h2>

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