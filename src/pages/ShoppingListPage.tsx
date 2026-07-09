import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonCheckbox } from '@ionic/react';
import PageHeader from '../components/PageHeader'; 
import BackLink from '../components/BackLink';   
import { buildShoppingList } from '../utils/shoppingListBuilder';
import type { ShoppingListItem } from '../models/ShoppingListItem';
import { getPlannerEntries } from '../repositories/plannerRepository';
import { loadAppSettings } from '../utils/appSettings';
import './RecipeForm.css';
import './ShoppingListPage.css';
import { isGuest } from '../utils/auth';

const CHECKED_ITEMS_STORAGE_KEY = 'bitebook_checked_shopping_items';

/**
 * Loads the checked state of shopping list items from localStorage.
 * @returns A record mapping item keys to their checked state
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
 * Saves the checked state of shopping list items to localStorage.
 * @param items The list of shopping list items whose checked state should be saved
 */
function saveCheckedItems(items: ShoppingListItem[]) {
  const checkedItems = items.reduce<Record<string, boolean>>((result, item) => {
    if (item.isChecked) {
      result[item.key] = true;
    }

    return result;
  }, {});

  localStorage.setItem(CHECKED_ITEMS_STORAGE_KEY, JSON.stringify(checkedItems));
}

/**
 * Sorts the shopping list items based on the user's settings
 * @param items The list of shopping list items to be sorted
 * @returns A new array of shopping list items sorted according to the user's preferences
 */
function sortShoppingList(items: ShoppingListItem[]): ShoppingListItem[] {
  const settings = loadAppSettings();

  return [...items].sort((firstItem, secondItem) => {
    if (settings.moveCheckedItemsDown && firstItem.isChecked !== secondItem.isChecked) {
      return firstItem.isChecked ? 1 : -1;
    }

    if (settings.shoppingListSortMode === 'recipe') {
      const recipeCompare = (firstItem.recipeTitle ?? '').localeCompare(secondItem.recipeTitle ?? '');

      if (recipeCompare !== 0) {
        return recipeCompare;
      }
    }

    return firstItem.name.localeCompare(secondItem.name);
  });
}

const ShoppingListPage: React.FC = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

useEffect(() => {
  const fetchPlannedRecipes = async () => {
    
    if (isGuest()) return;

    try {
      const entries = await getPlannerEntries();
      
      const realPlannedRecipes = entries.map(entry => entry.recipe);
      const settings = loadAppSettings();
      const checkedItems = settings.saveCheckedItems ? loadCheckedItems() : {};

      // generate the shopping list based on the planned recipes and user settings
      const generatedList = buildShoppingList(realPlannedRecipes, {
        groupShoppingListItems: settings.groupShoppingListItems,
      }).map((item) => ({
        ...item,
        isChecked: checkedItems[item.key] ?? false,
      }));
      
      setShoppingList(sortShoppingList(generatedList));
    } catch (err) {
      console.error("Fehler beim Laden der Einkaufsliste:", err);
    }
  };

  fetchPlannedRecipes();
}, []); 

// Toggles the checked state of a shopping list item and updates the list accordingly
const toggleCheck = (index: number) => {
  const settings = loadAppSettings();
  const updatedList = shoppingList.map((item, itemIndex) =>
    itemIndex === index ? { ...item, isChecked: !item.isChecked } : item,
  );
  const sortedList = sortShoppingList(updatedList);

  setShoppingList(sortedList);

  if (settings.saveCheckedItems) {
    saveCheckedItems(sortedList);
  }
};
  return (
    <IonPage>
      <PageHeader title="Einkaufsliste" />

      <IonContent fullscreen>
        <main className="recipe-form-page">
         
          <section className="recipe-form-hero shopping-list-hero">
            <p>Einkaufs-Assistent</p>
            <h1>Deine Einkaufsliste</h1>
            <span>Alle benötigten Zutaten für deine geplanten Rezepte im Überblick.</span>
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

              <div style={{ padding: '8px 0' }}>
                {shoppingList.map((item, index) => (
                  <div 
                    key={index} 
                    onClick={() => toggleCheck(index)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '14px 8px', 
                      borderBottom: '1px solid var(--app-border)',
                      cursor: 'pointer',
                      opacity: item.isChecked ? 0.5 : 1,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <IonCheckbox 
                      checked={item.isChecked} 
                      slot="start" 
                      style={{ marginRight: '16px', '--size': '20px' }}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '16px', 
                        fontWeight: 500,
                        textDecoration: item.isChecked ? 'line-through' : 'none',
                        color: 'var(--ion-color-dark)'
                      }}>
                        {item.name}
                        {item.recipeTitle && (
                          <small style={{ display: 'block', color: 'var(--app-muted)', fontWeight: 500 }}>
                            {item.recipeTitle}
                          </small>
                        )}
                      </span>
                      <span style={{ 
                        fontSize: '14px', 
                        color: 'var(--ion-color-medium)',
                        fontWeight: 'bold',
                        backgroundColor: 'var(--app-surface-muted)',
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}>
                        {item.amount > 0 ? `${item.amount} ${item.unit ?? ''}` : 'Bedarf'}
                      </span>
                    </div>
                  </div>
                ))}

                {shoppingList.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--ion-color-medium)' }}>
                    <p style={{ margin: 0, fontSize: '15px' }}>
                      Keine Zutaten auf der Liste. Plane zuerst Rezepte im Wochenplaner!
                    </p>
                  </div>
                )}
              </div>
            </fieldset>
          </div>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default ShoppingListPage;
