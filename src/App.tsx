import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  calendarOutline,
  cartOutline,
  heartOutline,
  homeOutline,
  personCircleOutline,
  restaurantOutline,
  searchOutline,
  settingsOutline,
} from 'ionicons/icons';

import EditRecipePage from './pages/EditRecipePage';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import OnboardingPage from './pages/OnboardingPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeForm from './pages/RecipeForm';
import RecipeListPage from './pages/RecipeListPage';
import SearchPage from './pages/SearchPage';
import Wochenplaner from './pages/Wochenplaner';
import ShoppingListPage from './pages/ShoppingListPage';
import SettingsPage from './pages/SettingsPage';
import { applyTheme, loadAppSettings } from './utils/appSettings';
import './App.css';

setupIonicReact();

export default function App() {
  const [onboardingCompleted] = useState(
      localStorage.getItem('onboardingCompleted') === 'true'
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
      localStorage.getItem('userRole') !== null
  );

  const [userRole, setUserRole] = useState<string | null>(
      localStorage.getItem('userRole')
  );

  const isAppAccessAllowed = userRole !== null;

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
          <IonMenu
              contentId="main-content"
              side="start"
              menuId="main-menu"
              className="app-menu"
              disabled={!isAppAccessAllowed}
          >
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
                <Route exact path="/welcome" component={WelcomePage} />
                <Route exact path="/onboarding" component={OnboardingPage} />

                <Route exact path="/login">
                  <LoginPage
                      setIsLoggedIn={setIsLoggedIn}
                      setAppUserRole={setUserRole}
                  />
                </Route>

                <Route exact path="/register" component={RegisterPage} />

                <Route exact path="/home">
                  {isAppAccessAllowed ? <HomePage /> : <Redirect to="/login" />}
                </Route>

                <Route exact path="/search">
                  {isAppAccessAllowed ? <SearchPage /> : <Redirect to="/login" />}
                </Route>

                <Route exact path="/planner">
                  {isAppAccessAllowed ? <Wochenplaner /> : <Redirect to="/login" />}
                </Route>

                <Route exact path="/favorites">
                  {isAppAccessAllowed ? <FavoritesPage /> : <Redirect to="/login" />}
                </Route>

                <Route exact path="/shopping-list">
                  {isAppAccessAllowed ? <ShoppingListPage /> : <Redirect to="/login" />}
                </Route>

                <Route exact path="/settings">
                  {isAppAccessAllowed ? <SettingsPage /> : <Redirect to="/login" />}
                </Route>

                <Route exact path="/recipes">
                  {isAppAccessAllowed ? <RecipeListPage /> : <Redirect to="/login" />}
                </Route>

                <Route exact path="/recipes/new">
                  {isAppAccessAllowed ? <RecipeForm /> : <Redirect to="/login" />}
                </Route>

                <Route exact path="/recipes/:id/edit">
                  {isAppAccessAllowed ? <EditRecipePage /> : <Redirect to="/login" />}
                </Route>

                <Route exact path="/recipes/:id">
                  {isAppAccessAllowed ? <RecipeDetailPage /> : <Redirect to="/login" />}
                </Route>

                <Route exact path="/">
                  {!onboardingCompleted ? (
                      <Redirect to="/welcome" />
                  ) : isLoggedIn ? (
                      <Redirect to="/home" />
                  ) : (
                      <Redirect to="/login" />
                  )}
                </Route>
              </Switch>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home" disabled={!isAppAccessAllowed}>
                <IonIcon icon={homeOutline} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>

              <IonTabButton tab="search" href="/search" disabled={!isAppAccessAllowed}>
                <IonIcon icon={searchOutline} />
                <IonLabel>Search</IonLabel>
              </IonTabButton>

              <IonTabButton tab="favorites" href="/favorites" disabled={!isAppAccessAllowed}>
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