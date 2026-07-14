import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonText,
} from '@ionic/react';
import { useEffect,useRef, useState } from 'react';
import PageHeader from '../components/PageHeader';
import RecipeCard from '../components/RecipeCard';
import type { Recipe } from '../models/Recipe';
import { getAllRecipes } from '../repositories/recipeRepository';
import './SearchPage.css';
// Zutaten-Synonyme
const ingredientSynonyms: Record<string, string[]> = {
  tomate: ['tomate', 'tomaten', 'tomato', 'tomatoes', 'toma'],
  basilikum: ['basilikum', 'basil', 'basilic'],
  mozzarella: ['mozzarella', 'käse', 'kaese', 'cheese', 'kase'],

  haehnchen: ['hähnchen', 'haehnchen', 'huhn', 'chicken', 'poulet'],
  rindfleisch: ['rindfleisch', 'rind', 'beef'],
  hackfleisch: ['hackfleisch', 'gehacktes', 'minced meat', 'ground beef'],
  lachs: ['lachs', 'salmon'],
  thunfisch: ['thunfisch', 'tuna'],

  kartoffel: ['kartoffel', 'kartoffeln', 'potato', 'potatoes'],
  reis: ['reis', 'rice'],
  nudeln: ['nudeln', 'pasta', 'spaghetti', 'macaroni', 'penne'],
  mehl: ['mehl', 'flour'],
  zucker: ['zucker', 'sugar'],
  salz: ['salz', 'salt'],
  pfeffer: ['pfeffer', 'pepper'],
  oel: ['öl', 'oel', 'oil', 'olivenöl', 'olivenoel', 'olive oil'],

  ei: ['ei', 'eier', 'egg', 'eggs'],
  milch: ['milch', 'milk'],
  butter: ['butter'],
  sahne: ['sahne', 'cream'],
  joghurt: ['joghurt', 'yogurt', 'yoghurt'],
  quark: ['quark'],

  zwiebel: ['zwiebel', 'zwiebeln', 'onion', 'onions'],
  knoblauch: ['knoblauch', 'garlic'],
  paprika: ['paprika', 'bell pepper', 'pepper'],
  karotte: ['karotte', 'karotten', 'möhre', 'moehre', 'carrot', 'carrots'],
  gurke: ['gurke', 'cucumber'],
  zucchini: ['zucchini', 'courgette'],
  avocado: ['avocado'],
  salat: ['salat', 'lettuce', 'salad'],
  spinat: ['spinat', 'spinach'],
  brokkoli: ['brokkoli', 'broccoli'],
  mais: ['mais', 'corn'],

  apfel: ['apfel', 'äpfel', 'aepfel', 'apple', 'apples'],
  banane: ['banane', 'bananen', 'banana', 'bananas'],
  zitrone: ['zitrone', 'zitronen', 'lemon', 'lemons'],
  orange: ['orange', 'orangen'],
  erdbeere: ['erdbeere', 'erdbeeren', 'strawberry', 'strawberries'],

  schokolade: ['schokolade', 'chocolate'],
  kakao: ['kakao', 'cocoa'],
  vanille: ['vanille', 'vanilla'],
  zimt: ['zimt', 'cinnamon'],
};
// Converts text to a searchable format:
// lowercase, no spaces, and German special characters replaced
function normalizeText(value: string): string {
  return value
      .toLowerCase()
      .trim()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss');
}
// Converts an ingredient or search input to the main ingredient key
function normalizeIngredient(input: string): string {
  const value = normalizeText(input);

  // go through all Ingredients
  for (const [key, words] of Object.entries(ingredientSynonyms)) {
    // 1-case word(tomaten) includes value (tomat)
    // 2-case value(tomatensuppe) includes word(tomaten)
    if (words.some((word) => normalizeText(word).includes(value) || value.includes(normalizeText(word)))) {
      return key;
    }
  }

  return value;
}

export default function SearchPage() {
  // recipes is current list
  // Stores all loaded recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // query is the text that is searched for
  // Stores the current search text
  const [query, setQuery] = useState('');
  // Stores the selected category filter
  const [selectedCategory, setSelectedCategory] = useState<Recipe['category'] | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Referez to searchfield
  const SearchInputRef = useRef<HTMLIonSearchbarElement>(null);

  // After page load, wait 300ms and focus the search field
  useEffect(() => {
    setTimeout(() => {
      SearchInputRef.current?.setFocus();
    }, 300);
  }, []);

// Load all recipes once when the page opens
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
    { label: 'Vegetarisch', value: 'Vegetarisch', icon: '🥬' },
    { label: 'Pescetarisch', value: 'Pescetarisch', icon: '🐟' },
    { label: 'Dessert', value: 'Dessert', icon: '🧁' },
    { label: 'Schnell', value: 'Schnell', icon: '⚡' },
    { label: 'Pasta', value: 'Pasta', icon: '🍕' },
    { label: 'Hauptgericht', value: 'Hauptgericht', icon: '🍜' },
    { label: 'Gesund', value: 'Gesund', icon: '🥗' },
  ];
    function getIngredientText(ingredient: string | { name: string }): string {
        return typeof ingredient === 'string' ? ingredient : ingredient.name;
    }

// new filteredRicipes List
// Filter recipes by search text and selected category
  const filteredRecipes = recipes.filter((recipe) => {
    // normalze input
    const lowerQuery = normalizeText(query);
    // Converts an search input to the main ingredient key
    const normalizedQueryIngredient = normalizeIngredient(query);
    // normlize all recipe ingredient
      const recipeIngredients = recipe.ingredients.map((ingredient) =>
          normalizeIngredient(getIngredientText(ingredient))
      );
    // 4 Cases 1- searchfild is empty Check title, description, and ingredients
    // 2- normlized Recipetitle includes input
    // 3- normlized Recipedescription includes input
    // 4- min one of normlized recipeingredients includes input
    const matchesSearch =
        query === '' ||
        normalizeText(recipe.title).includes(lowerQuery) ||
        normalizeText(recipe.description).includes(lowerQuery) ||
        recipeIngredients.some((ingredient) =>
            ingredient.includes(normalizedQueryIngredient)
        );
    // Categorien-Filter 2 Cases
    // 1- selectedCategory is null -> all recipes
    // 2- selectedCategory is not null -> only recipes with selectedCategory
    const matchesCategory =
        selectedCategory === null || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
      <IonPage>
        <PageHeader title="Suche" />

        <IonContent className="ion-padding">


          <IonSearchbar
              ref={SearchInputRef}
              placeholder="Mit Rezeptname oder Zutat suchen"
              value={query}
              onIonInput={(event) => setQuery(event.detail.value ?? '')}
          />



          <h2>Kategorien</h2>

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
