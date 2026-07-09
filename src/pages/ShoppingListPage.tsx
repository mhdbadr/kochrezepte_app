import React, { useEffect, useMemo, useState } from 'react';
import { IonCheckbox, IonContent, IonPage } from '@ionic/react';
import BackLink from '../components/BackLink';
import PageHeader from '../components/PageHeader';
import type { ShoppingListItem } from '../models/ShoppingListItem';
import { getPlannerEntries } from '../repositories/plannerRepository';
import { isGuest } from '../utils/auth';
import { loadAppSettings } from '../utils/appSettings';
import { buildShoppingListSections, type ShoppingListRecipeSection } from '../utils/shoppingListBuilder';
import './RecipeForm.css';
import './ShoppingListPage.css';

const CHECKED_ITEMS_STORAGE_KEY = 'bitebook_checked_shopping_items';
const WEEKDAY_ORDER = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

/**
 * Loads the checked items from local storage
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
 * Sorts the shopping list recipe sections based on the order of weekdays and recipe titles.
 * @param sections An array of shopping list recipe sections to be sorted.
 * @returns A new array of shopping list recipe sections sorted by weekday and recipe title.
 */
function sortSectionsByWeekday(sections: ShoppingListRecipeSection[]): ShoppingListRecipeSection[] {
  return [...sections].sort((firstSection, secondSection) => {
    const firstDayIndex = WEEKDAY_ORDER.indexOf(firstSection.dayOfWeek);
    const secondDayIndex = WEEKDAY_ORDER.indexOf(secondSection.dayOfWeek);
    // ensure that sections with unknown weekdays are sorted to the end of the list
    const firstSortValue = firstDayIndex === -1 ? WEEKDAY_ORDER.length : firstDayIndex;
    const secondSortValue = secondDayIndex === -1 ? WEEKDAY_ORDER.length : secondDayIndex;

    // sort by weekday first, then by recipe title
    if (firstSortValue !== secondSortValue) {
      return firstSortValue - secondSortValue;
    }

    return firstSection.recipeTitle.localeCompare(secondSection.recipeTitle);
  });
}

function formatAmount(item: ShoppingListItem): string {
  return item.amount > 0 ? `${item.amount} ${item.unit ?? ''}`.trim() : 'n. B.';
}

const ShoppingListPage: React.FC = () => {
  const [sections, setSections] = useState<ShoppingListRecipeSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
      // Fetch the planned recipes and build the shopping list sections
    async function fetchPlannedRecipes() {
      if (isGuest()) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage('');

        const entries = await getPlannerEntries();
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

        setSections(sortSectionsByWeekday(generatedSections));
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
         
          <section className="recipe-form-hero shopping-list-hero">
            <p>Einkaufs-Assistent</p>
            <h1>Deine Einkaufsliste</h1>
            <span>Alle Zutaten aus deinem Wochenplan in einer einfachen Liste.</span>
          </section>

          {isGuest() && (
            <div className="shopping-guest-banner">
              Du bist als Gast angemeldet. Bitte melde dich an, um deine persoenliche Einkaufsliste zu nutzen.
            </div>
          )}

          <div className="recipe-form shopping-list-form">
            <fieldset className="recipe-form-card">
              <legend>Zutaten zum Einkaufen</legend>

              {errorMessage && <p className="app-error-message">{errorMessage}</p>}

              <p className="shopping-list-progress">
                {checkedItemCount} von {totalItemCount} Zutaten erledigt
              </p>

              {isLoading && <p className="shopping-list-status">Einkaufsliste wird geladen...</p>}

              {!isLoading && sections.length === 0 && !errorMessage && (
                <section className="shopping-list-empty">
                  <h2>Noch keine Zutaten</h2>
                  <p>Plane zuerst Rezepte im Wochenplaner. Danach erscheinen hier die passenden Zutaten.</p>
                </section>
              )}

              <div className="shopping-list-sections">
                {sections.map((section) => (
                  <article className="shopping-list-section" key={section.key}>
                    <h2 className="shopping-list-section__title">
                      {section.recipeTitle}
                      <span>{section.dayOfWeek}</span>
                    </h2>

                    <div className="shopping-list-section__items">
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
