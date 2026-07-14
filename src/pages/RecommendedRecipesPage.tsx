import { IonButton, IonContent, IonIcon, IonPage, useIonViewWillEnter } from '@ionic/react';
import { leafOutline, settingsOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import RecipeCard from '../components/RecipeCard';
import { useFeedbackToast } from '../hooks/useFeedbackToast';
import type { DietaryPreference } from '../models/AppSettings';
import type { Recipe } from '../models/Recipe';
import { getNewestRecommendedRecipes } from '../repositories/recommendedRecipeRepository';
import { loadAppSettings } from '../utils/appSettings';
import './RecommendedRecipesPage.css';

/**
 * Represents a selectable dietary preference option for recommended recipes.
 */
const preferences: Array<{
  value: DietaryPreference;
  label: string;
}> = [
  { value: 'all', label: 'Alle' },
  { value: 'Vegan', label: 'Vegan' },
  { value: 'Vegetarisch', label: 'Vegetarisch' },
  { value: 'Pescetarisch', label: 'Pescetarisch' },
];

export default function RecommendedRecipesPage() {
  const { showErrorToast } = useFeedbackToast();
  // Load the preference from local storage on component mount.
  const [preference, setPreference] = useState<DietaryPreference>(
    () => loadAppSettings().dietaryPreference,
  );
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  // Load the preference from local storage whenever the view is about to enter.
  useIonViewWillEnter(() => {
    setPreference(loadAppSettings().dietaryPreference);
  });

  useEffect(() => {
    let isPageActive = true;

    /**
     * Loads the newest recommended recipes based on the user's dietary preference and updates the state accordingly.
     */
    async function loadRecommendations() {
      setIsLoading(true);
      setHasLoadError(false);
      const result = await getNewestRecommendedRecipes(preference);

      if (isPageActive) {
        if (result === null) {
          setRecipes([]);
          setHasLoadError(true);
          showErrorToast('Deine Rezeptvorschläge konnten nicht geladen werden. Bitte versuche es erneut.');
        } else {
          setRecipes(result);
        }

        setIsLoading(false);
      }
    }

    void loadRecommendations();

    return () => {
      isPageActive = false;
    };
  }, [preference]);

  // Find the selected preference object for display purposes.
  const selectedPreference = preferences.find((option) => option.value === preference)!;

  return (
    <IonPage>
      <PageHeader title="Für dich" />

      <IonContent fullscreen>
        <main className="recommended-recipes-page">
          <section className="recommended-recipes-hero">
            <div>
              <p>Persönlich ausgewählt</p>
              <h1>Neue Rezepte für deinen Geschmack</h1>
              <span>
                Entdecke die neuesten öffentlichen Rezepte anderer Benutzer, passend zu deiner Ernährung.
              </span>
            </div>
          </section>

          <section className="recommended-preference-summary" aria-labelledby="preference-title">
            <div className="recommended-preference-summary__content">
              <div>
                <span>Ernährungspräferenz</span>
                <strong id="preference-title">{selectedPreference.label}</strong>
              </div>
            </div>

            <IonButton routerLink="/settings" fill="clear" size="small">
              <IonIcon icon={settingsOutline} slot="start" />
              Ändern
            </IonButton>
          </section>

          <section className="recommended-results" aria-live="polite">
            <div className="recommended-results__heading">
              <div>
                <p>Neu eingestellt</p>
                <h2>Passend für dich</h2>
              </div>
              {!isLoading && !hasLoadError && (
                <span>{recipes.length} Rezepte · {selectedPreference.label}</span>
              )}
            </div>

            {isLoading && (
              <div className="recommended-loading" aria-label="Rezeptvorschläge werden geladen">
                <span />
                <span />
                <span />
              </div>
            )}

            {!isLoading && !hasLoadError && recipes.length === 0 && (
              <div className="recommended-empty">
                <IonIcon icon={leafOutline} />
                <h3>Noch keine passenden Rezepte</h3>
                <p>Probiere eine andere Ernährungspräferenz aus.</p>
              </div>
            )}

            <div className="recommended-recipes-grid">
              {recipes.map((recipe) => (
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
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
}
