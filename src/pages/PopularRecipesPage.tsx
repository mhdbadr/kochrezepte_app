import { IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import RecipeCard from '../components/RecipeCard';
import {
  getPopularRecipes,
  type PopularRecipeResult,
  type PopularityPeriod,
} from '../repositories/popularRecipeRepository';
import { useFeedbackToast } from '../hooks/useFeedbackToast';
import './PopularRecipesPage.css';

/**
 * Represents a selectable period option for popular recipes.
 */
const periods: Array<{ value: PopularityPeriod; label: string; description: string }> = [
  { value: 'week', label: 'Woche', description: 'der letzten 7 Tage' },
  { value: 'month', label: 'Monat', description: 'der letzten 30 Tage' },
  { value: 'year', label: 'Jahr', description: 'der letzten 365 Tage' },
  { value: 'all', label: 'Gesamt', description: 'des gesamten Zeitraums' },
];

export default function PopularRecipesPage() {
  const { showErrorToast } = useFeedbackToast();
  const [period, setPeriod] = useState<PopularityPeriod>('month');
  const [popularRecipes, setPopularRecipes] = useState<PopularRecipeResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    let isPageActive = true;

    /**
     * Loads the popular recipes for the selected period and updates the state accordingly.
     */
    async function loadPopularRecipes() {
      try {
        setIsLoading(true);
        setHasLoadError(false);
        const results = await getPopularRecipes(period);

        if (isPageActive) {
          if (results === null) {
            setPopularRecipes([]);
            setHasLoadError(true);
            showErrorToast('Die beliebtesten Rezepte konnten nicht geladen werden. Bitte versuche es erneut.');
          } else {
            setPopularRecipes(results);
          }
        }
      } catch (error) {
        console.error('Beliebte Rezepte konnten nicht geladen werden:', error);

        if (isPageActive) {
          setPopularRecipes([]);
          setHasLoadError(true);
          showErrorToast('Die beliebtesten Rezepte konnten nicht geladen werden. Bitte versuche es erneut.');
        }
      } finally {
        if (isPageActive) {
          setIsLoading(false);
        }
      }
    }

    void loadPopularRecipes();

    return () => {
      isPageActive = false;
    };
  }, [period]);

  /**
   * Returns the selected period option based on the current period state.
   */
  const selectedPeriod = periods.find((option) => option.value === period)!;

  return (
    <IonPage>
      <PageHeader title="Beliebte Rezepte" />

      <IonContent fullscreen>
        <main className="popular-recipes-page">
          <section className="popular-recipes-hero">
            <p>Community-Favoriten</p>
            <h1>Die beliebtesten Rezepte</h1>
            <span>
              Die Rangfolge berücksichtigt die Anzahl und den Durchschnitt der Bewertungen.
            </span>
          </section>

          <div className="popular-period-selector" aria-label="Zeitraum auswählen">
            {periods.map((option) => (
              <button
                type="button"
                key={option.value}
                className={
                  period === option.value
                    ? 'popular-period-selector__button popular-period-selector__button--active'
                    : 'popular-period-selector__button'
                }
                aria-pressed={period === option.value}
                onClick={() => setPeriod(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <section className="popular-recipes-results" aria-live="polite">
            <div className="popular-recipes-results__heading">
              <div>
                <p>Auswertung {selectedPeriod.description}</p>
                <h2>Top-Rezepte</h2>
              </div>
              {!isLoading && !hasLoadError && (
                <span>{popularRecipes.length} gefunden</span>
              )}
            </div>

            {isLoading && <p className="popular-recipes-status">Auswertung wird geladen...</p>}
            {!isLoading && !hasLoadError && popularRecipes.length === 0 && (
              <p className="popular-recipes-status">
                In diesem Zeitraum wurden noch keine Rezepte bewertet.
              </p>
            )}

            <div className="popular-recipes-grid">
              {popularRecipes.map((result, index) => (
                <article className="popular-recipe" key={result.recipe.id}>
                  <span className="popular-recipe__rank">#{index + 1}</span>
                  <RecipeCard
                    id={result.recipe.id}
                    title={result.recipe.title}
                    imageUrl={result.recipe.imageUrl ?? ''}
                    duration={result.recipe.preparationTime}
                    difficulty={result.recipe.difficulty}
                    category={result.recipe.category}
                    rating={result.averageRating}
                    to={`/recipes/${result.recipe.id}`}
                  />
                  <p className="popular-recipe__rating-count">
                    {result.ratingCount === 1
                      ? '1 Bewertung im Zeitraum'
                      : `${result.ratingCount} Bewertungen im Zeitraum`}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
}
