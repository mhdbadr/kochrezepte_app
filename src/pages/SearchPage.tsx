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

export default function SearchPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'recipes' | 'ingredients'>('recipes');
  const [selectedCategory, setSelectedCategory] = useState<Recipe['category'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadRecipes() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        // Search reads recipes through the repository, so this page uses Supabase instead of mock data.
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
    { label: 'Tomaten', icon: '🍅' },
    { label: 'Basilikum', icon: '☘️' },
    { label: 'Mozzarella', icon: '🧀' },
    { label: 'Haehnchen', icon: '🍗' },
    { label: 'Avocado', icon: '🥑' },
    { label: 'Zucchini', icon: '🥒' },
  ];

  // Combine text search and category filtering before rendering the result cards.
  const filteredRecipes = recipes.filter((recipe) => {
    const lowerQuery = query.toLowerCase();
    const matchesSearch =
      query === '' ||
      (searchMode === 'recipes'
        ? recipe.title.toLowerCase().includes(lowerQuery)
        : recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(lowerQuery)));

    const matchesCategory = selectedCategory === null || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <IonPage>
      <PageHeader title="Suche" />

      <IonContent className="ion-padding">
        <IonSegment value={searchMode} onIonChange={(event) => setSearchMode(event.detail.value as 'recipes' | 'ingredients')}>
          <IonSegmentButton value="recipes">
            <IonLabel>Rezepte</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="ingredients">
            <IonLabel>Zutaten</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <IonSearchbar
          placeholder={searchMode === 'recipes' ? 'Nach Rezepten suchen' : 'Nach Zutaten suchen'}
          value={query}
          onIonInput={(event) => setQuery(event.detail.value ?? '')}
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
                  <div className="ingredient-icon">{ingredient.icon}</div>
                  <span>{ingredient.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <h2>Kategorien</h2>

        <div className="category-grid">
          {categories.map((category) => (
            <button className="category-item" key={category.value} onClick={() => setSelectedCategory(category.value)}>
              <div className="category-icon">{category.icon}</div>
              <span>{category.label}</span>
            </button>
          ))}

          <button className="category-item" onClick={() => setSelectedCategory(null)}>
            <div className="category-icon">🍽️</div>
            <span>Alle</span>
          </button>
        </div>

        <h2>Suchergebnisse</h2>

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
