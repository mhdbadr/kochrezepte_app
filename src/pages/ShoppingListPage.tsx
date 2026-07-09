import React, { useEffect, useMemo, useState } from 'react';
import { IonCheckbox, IonContent, IonPage } from '@ionic/react';
import BackLink from '../components/BackLink';
import PageHeader from '../components/PageHeader';
import type { ShoppingListItem } from '../models/ShoppingListItem';
import { getPlannerEntries } from '../repositories/plannerRepository';
import { loadAppSettings } from '../utils/appSettings';
import { buildShoppingListSections, type ShoppingListRecipeSection } from '../utils/shoppingListBuilder';
import './RecipeForm.css';
import './ShoppingListPage.css';
import { isGuest } from '../utils/auth';

const CHECKED_ITEMS_STORAGE_KEY = 'bitebook_checked_shopping_items';

/**
 * Loads the checked items from local storage and returns them as a record of item keys to boolean values.
 * If no checked items are found or if there is an error parsing the stored data, an empty object is returned.
 * @returns A record where the keys are item keys and the values are booleans indicating whether the item is checked.
 */
function loadCheckedItems(): Record<string, boolean> {
  const rawCheckedItems = localStorage.getItem(CHECKED_ITEMS_STORAGE_KEY);

  if (!rawCheckedItems) {
    return {};
  }

  try {
    return JSON.parse(rawCheckedItems);
  } catch {
    return {};
  }
}

/**
 * Saves the checked items to local storage.
 * @param sections An array of shopping list recipe sections containing the items to be saved.
 */
function saveCheckedItems(sections: ShoppingListRecipeSection[]) {
    // Create a record of checked items where the keys are item keys and the values are booleans indicating whether the item is checked.
    const checkedItems = sections.reduce<Record<string, boolean>>((result, section) => {
    section.items.forEach((item) => {
      if (item.isChecked) {
        result[item.key] = true;
      }
    });

    return result;
  }, {});

  localStorage.setItem(CHECKED_ITEMS_STORAGE_KEY, JSON.stringify(checkedItems));
}

/**
 * Sorts the shopping list items based on the application settings.
 * @param items An array of shopping list items to be sorted.
 * @returns A new array of shopping list items sorted according to the application settings.
 */
function sortSectionItems(items: ShoppingListItem[]): ShoppingListItem[] {
  const settings = loadAppSettings();

  return [...items].sort((firstItem, secondItem) => {
    if (settings.moveCheckedItemsDown && firstItem.isChecked !== secondItem.isChecked) {
      return firstItem.isChecked ? 1 : -1;
    }

    return firstItem.name.localeCompare(secondItem.name);
  });
}

/**
 * Formats the amount and unit of a shopping list item for display.
 * @param item The shopping list item whose amount and unit are to be formatted.
 * @returns A string representing the formatted amount and unit
 */
function formatAmount(item: ShoppingListItem): string {
  return item.amount > 0 ? `${item.amount} ${item.unit ?? ''}`.trim() : 'n. B.';
}

const ShoppingListPage: React.FC = () => {
  const [sections, setSections] = useState<ShoppingListRecipeSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

useEffect(() => {
  const fetchPlannedRecipes = async () => {
    
    if (isGuest()) return;

    try {
      const entries = await getPlannerEntries();
      
      const realPlannedRecipes = entries.map(entry => entry.recipe);
      const settings = loadAppSettings();
      const checkedItems = settings.saveCheckedItems ? loadCheckedItems() : {};

        const generatedSections = buildShoppingListSections(entries).map((section) => ({
          ...section,
          items: sortSectionItems(
            section.items.map((item) => ({
              ...item,
              isChecked: checkedItems[item.key] ?? false,
            })),
          ),
        }));

        setSections(generatedSections);
      } catch (error) {
        console.error('Fehler beim Laden der Einkaufsliste:', error);
        setErrorMessage('Die Einkaufsliste konnte nicht geladen werden. Bitte versuche es erneut.');
      } finally {
        setIsLoading(false);
      }
    }
  
    void fetchPlannedRecipes();
  }, []);

  const totalItemCount = useMemo(
    () => sections.reduce((total, section) => total + section.items.length, 0),
    [sections],
  );

  const checkedItemCount = useMemo(
    () =>
      sections.reduce(
        (total, section) => total + section.items.filter((item) => item.isChecked).length,
        0,
      ),
    [sections],
  );

  function toggleCheck(sectionKey: string, itemKey: string) {
    const settings = loadAppSettings();
    const updatedSections = sections.map((section) => {
      if (section.key !== sectionKey) {
        return section;
      }

      return {
        ...section,
        items: sortSectionItems(
          section.items.map((item) =>
            item.key === itemKey ? { ...item, isChecked: !item.isChecked } : item,
          ),
        ),
      };
    });

    setSections(updatedSections);

    if (settings.saveCheckedItems) {
      saveCheckedItems(updatedSections);
    }
  }

  return (
    <IonPage>
      <PageHeader title="Einkaufsliste" />

      <IonContent fullscreen>
        <main className="recipe-form-page">
          <BackLink to="/home" label="Zurueck zur Uebersicht" />

          <section className="recipe-form-hero shopping-list-hero">
            <p>Einkaufs-Assistent</p>
            <h1>Deine Einkaufsliste</h1>
            <span>Alle Zutaten sind nach den Rezepten aus deinem Wochenplan sortiert.</span>
          </section>

          {/* Show a friendly notice if the user is a guest using a clean CSS class */}
                          {isGuest() && (
                              <div className="shopping-guest-banner">
                                   Du bist als Gast angemeldet. Bitte melde dich an, um deine persönliche Einkaufsliste zu nutzen!
                              </div>
                          )}


          <div className="recipe-form">
            <fieldset className="recipe-form-card">
              <legend>Zutaten zum Einkaufen</legend>

          <section className="shopping-list-summary">
            <div>
              <span>Geplante Rezepte</span>
              <strong>{sections.length}</strong>
            </div>
            <div>
              <span>Zutaten</span>
              <strong>{totalItemCount}</strong>
            </div>
            <div>
              <span>Erledigt</span>
              <strong>
                {checkedItemCount}/{totalItemCount}
              </strong>
            </div>
          </section>

          {isLoading && <p className="shopping-list-status">Einkaufsliste wird geladen...</p>}

          {!isLoading && sections.length === 0 && !errorMessage && (
            <section className="shopping-list-empty">
              <h2>Noch keine Zutaten</h2>
              <p>Plane zuerst Rezepte im Wochenplaner. Danach erscheinen hier die passenden Zutaten.</p>
            </section>
          )}

          <div className="shopping-list-sections">
            {sections.map((section) => (
              <article className="shopping-list-card" key={section.key}>
                <header className="shopping-list-card__header">
                  <div>
                    <span>{section.dayOfWeek}</span>
                    <h2>{section.recipeTitle}</h2>
                  </div>
                  <strong>{section.items.length} Zutaten</strong>
                </header>

                <div className="shopping-list-card__items">
                  {section.items.map((item) => (
                    <button
                      className={
                        item.isChecked
                          ? 'shopping-list-item shopping-list-item--checked'
                          : 'shopping-list-item'
                      }
                      key={item.key}
                      type="button"
                      onClick={() => toggleCheck(section.key, item.key)}
                    >
                      <IonCheckbox checked={item.isChecked} />
                      <span className="shopping-list-item__name">{item.name}</span>
                      <span className="shopping-list-item__amount">{formatAmount(item)}</span>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
          </fieldset>
         </div> 
        </main>
      </IonContent>
    </IonPage>
  );
};

export default ShoppingListPage;
