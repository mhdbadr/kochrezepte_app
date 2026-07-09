import React, { useEffect, useState } from 'react';
import { IonContent,  IonItem, IonLabel,  IonList,  IonPage,  IonSelect,
    IonSelectOption,  IonToggle, } from '@ionic/react';
import BackLink from '../components/BackLink';
import PageHeader from '../components/PageHeader';
import { applyTheme, loadAppSettings, saveAppSettings, } from '../utils/appSettings';
import { type AppSettings,  type ShoppingListSortMode,  type ThemeMode, } from '../models/AppSettings';
import './RecipeForm.css';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());

  // Whenever the settings state changes, save the new settings to localStorage and apply the selected theme
  useEffect(() => {
    saveAppSettings(settings);
    applyTheme(settings.themeMode);
  }, [settings]);

  // Utility function to update specific settings while keeping the rest unchanged
  const updateSettings = (changes: Partial<AppSettings>) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      ...changes,
    }));
  };

  return (
    <IonPage>
      <PageHeader title="Einstellungen" />

      <IonContent fullscreen>
        <main className="recipe-form-page">
          
          <section className="recipe-form-hero">
            <p>App-Einstellungen</p>
            <h1>Deine Einstellungen</h1>
            <span>Lege fest, wie Einkaufsliste und Darstellung in BiteBook funktionieren.</span>
          </section>

          <div className="recipe-form">
            <fieldset className="recipe-form-card">
              <legend>Einkaufsliste</legend>

              <IonList lines="full">
                <IonItem>
                  <IonLabel>Sortierung</IonLabel>
                  <IonSelect
                    value={settings.shoppingListSortMode}
                    interface="popover"
                    onIonChange={(event) =>
                      updateSettings({
                        shoppingListSortMode: event.detail.value as ShoppingListSortMode,
                      })
                    }
                  >
                    <IonSelectOption value="alphabetical">Alphabetisch</IonSelectOption>
                    <IonSelectOption value="recipe">Nach Rezept</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel>Abgehakte Zutaten nach unten</IonLabel>
                  <IonToggle
                    checked={settings.moveCheckedItemsDown}
                    onIonChange={(event) =>
                      updateSettings({ moveCheckedItemsDown: event.detail.checked })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Abgehakte Zutaten speichern</IonLabel>
                  <IonToggle
                    checked={settings.saveCheckedItems}
                    onIonChange={(event) =>
                      updateSettings({ saveCheckedItems: event.detail.checked })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>Einkaufsliste automatisch zusammenfassen</IonLabel>
                  <IonToggle
                    checked={settings.groupShoppingListItems}
                    onIonChange={(event) =>
                      updateSettings({ groupShoppingListItems: event.detail.checked })
                    }
                  />
                </IonItem>
              </IonList>
            </fieldset>

            <fieldset className="recipe-form-card">
              <legend>Design</legend>

              <IonList lines="full">
                <IonItem>
                  <IonLabel>Theme</IonLabel>
                  <IonSelect
                    value={settings.themeMode}
                    interface="popover"
                    onIonChange={(event) =>
                      updateSettings({ themeMode: event.detail.value as ThemeMode })
                    }
                  >
                    <IonSelectOption value="system">Systemstandard</IonSelectOption>
                    <IonSelectOption value="light">Hell</IonSelectOption>
                    <IonSelectOption value="dark">Dunkel</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
            </fieldset>
          </div>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;

