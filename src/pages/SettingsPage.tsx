import React, { useEffect, useState } from 'react';
import { IonContent,  IonItem, IonLabel,  IonList,  IonPage,  IonSelect,
    IonSelectOption,  IonToggle, } from '@ionic/react';
import BackLink from '../components/BackLink';
import PageHeader from '../components/PageHeader';
import { applyTheme, loadAppSettings, saveAppSettings, } from '../utils/appSettings';
import { type AppSettings, type ThemeMode } from '../models/AppSettings';
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
          <BackLink to="/home" label="Zurück zur Übersicht" />

          <section className="recipe-form-hero">
            <p>App-Einstellungen</p>
            <h1>Deine Einstellungen</h1>
            <span>Pass die App an deine Nutzung an.</span>
          </section>

          <div className="recipe-form">
            <fieldset className="recipe-form-card">
              <legend>Einkaufsliste</legend>

              <IonList lines="full">
                <IonItem>
                  <IonLabel>
                    <h3>Erledigtes nach unten</h3>
                    <p>Abgehakte Zutaten wandern nach unten.</p>
                  </IonLabel>
                  <IonToggle
                    checked={settings.moveCheckedItemsDown}
                    onIonChange={(event) =>
                      updateSettings({ moveCheckedItemsDown: event.detail.checked })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3>Haken merken</h3>
                    <p>Erledigte Zutaten bleiben abgehakt.</p>
                  </IonLabel>
                  <IonToggle
                    checked={settings.saveCheckedItems}
                    onIonChange={(event) =>
                      updateSettings({ saveCheckedItems: event.detail.checked })
                    }
                  />
                </IonItem>
              </IonList>
            </fieldset>

            <fieldset className="recipe-form-card">
              <legend>Design</legend>

              <IonList lines="full">
                <IonItem>
                  <IonLabel>
                    <h3>Darstellung</h3>
                    <p>Hell, dunkel oder Systemstandard.</p>
                  </IonLabel>
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
