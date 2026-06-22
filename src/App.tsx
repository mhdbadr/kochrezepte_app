import { IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle,
  IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact, } from '@ionic/react';
import { useEffect } from 'react';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import {
  calendarOutline,
  heartOutline,
  homeOutline,
  personCircleOutline,
  restaurantOutline,
  searchOutline,
  settingsOutline,
  cartOutline,
} from 'ionicons/icons';

// Importing all page components used in the app's routing configuration.
import EditRecipePage from './pages/EditRecipePage';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeForm from './pages/RecipeForm';
import RecipeListPage from './pages/RecipeListPage';
import SearchPage from './pages/SearchPage';
import Wochenplaner from './pages/Wochenplaner';
import './App.css';
import ShoppingListPage from './pages/ShoppingListPage';
import SettingsPage from './pages/SettingsPage';
import { applyTheme, loadAppSettings } from './utils/appSettings';

setupIonicReact(); // Initialize Ionic React with default settings.

export default function App() {
  useEffect(() => {
    const updateTheme = () => applyTheme(loadAppSettings().themeMode);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

    updateTheme();
    systemTheme.addEventListener('change', updateTheme);

    return () => systemTheme.removeEventListener('change', updateTheme);
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        {/* The drawer contains secondary actions so it does not duplicate the bottom tab navigation. */}
        <IonMenu contentId="main-content" side="start" menuId="main-menu" className="app-menu">
          <IonContent>
            <section className="app-menu__intro">
              <span>BiteBook</span>
              <h2>Menü</h2>
              <p>Bereiche für Rezepterstellung, Wochenplaner und Einstellungen</p>
            </section>

            <IonList lines="none">
              <IonMenuToggle autoHide={true}>
                <IonItem routerLink="/recipes/new" button>
                  <IonIcon icon={restaurantOutline} slot="start" />
                  <IonLabel>Neues Rezept</IonLabel>
                </IonItem>
              </IonMenuToggle>

              <IonMenuToggle autoHide={true}>
                <IonItem routerLink="/planner" button>
                  <IonIcon icon={calendarOutline} slot="start" />
                  <IonLabel>Wochenplaner</IonLabel>
                </IonItem>
              </IonMenuToggle>


              <IonMenuToggle autoHide={true}>
                <IonItem routerLink="/shopping-list" button>
                  <IonIcon icon={cartOutline} slot="start" />
                  <IonLabel>Einkaufsliste</IonLabel>
                </IonItem>
              </IonMenuToggle>

              <IonMenuToggle autoHide={true}>
                <IonItem routerLink="/settings" button>
                <IonIcon icon={settingsOutline} slot="start" />
                <IonLabel>Einstellungen</IonLabel>
              </IonItem>
              </IonMenuToggle>
            </IonList>
          </IonContent>
        </IonMenu>

        <IonTabs>
          <IonRouterOutlet id="main-content">
            <Switch>
              {/* Main app routes provided by the navigation/search epic. */}
              <Route exact path="/home" component={HomePage} />
              <Route exact path="/search" component={SearchPage} />
              <Route exact path="/planner" component={Wochenplaner} />
              <Route exact path="/favorites" component={FavoritesPage} />
              <Route exact path="/shopping-list" component={ShoppingListPage} />
              <Route exact path="/settings" component={SettingsPage} />
              
              {/* The login page is a placeholder for future authentication features. */}
              <Route exact path="/login" component={LoginPage} />

              {/* Recipe core routes for listing, creating, editing, and viewing recipes. */}
              <Route exact path="/recipes" component={RecipeListPage} />
              {/* Specific recipe routes must be checked before dynamic string ID routes. */}
              <Route exact path="/recipes/new" component={RecipeForm} />
              <Route exact path="/recipes/:id/edit" component={EditRecipePage} />
              <Route exact path="/recipes/:id" component={RecipeDetailPage} />
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
            </Switch>
          </IonRouterOutlet>

          {/* Primary navigation stays in the bottom tab bar only. */}
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="search" href="/search">
              <IonIcon icon={searchOutline} />
              <IonLabel>Search</IonLabel>
            </IonTabButton>

            <IonTabButton tab="favorites" href="/favorites">
              <IonIcon icon={heartOutline} />
              <IonLabel>Favorites</IonLabel>
            </IonTabButton>

            <IonTabButton tab="profile" href="/login">
              <IonIcon icon={personCircleOutline} />
              <IonLabel>Profil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}
