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
import { useState } from 'react';

import {
  calendarOutline,
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

import './App.css';

setupIonicReact();

export default function App() {
  const [onboardingCompleted] = useState(
      localStorage.getItem('onboardingCompleted') === 'true'
  );

  return (
      <IonApp>
        <IonReactRouter>
          <IonMenu
              contentId="main-content"
              side="start"
              menuId="main-menu"
              className="app-menu"
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

                <IonItem button disabled>
                  <IonIcon icon={settingsOutline} slot="start" />
                  <IonLabel>Einstellungen</IonLabel>
                </IonItem>
              </IonList>
            </IonContent>
          </IonMenu>

          <IonTabs>
            <IonRouterOutlet id="main-content">
              <Switch>
                {/* Welcome & Auth */}
                <Route exact path="/welcome" component={WelcomePage} />
                <Route exact path="/onboarding" component={OnboardingPage} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/register" component={RegisterPage} />

                {/* Main pages */}
                <Route exact path="/home" component={HomePage} />
                <Route exact path="/search" component={SearchPage} />
                <Route exact path="/planner" component={Wochenplaner} />
                <Route exact path="/favorites" component={FavoritesPage} />

                {/* Recipe pages */}
                <Route exact path="/recipes" component={RecipeListPage} />
                <Route exact path="/recipes/new" component={RecipeForm} />
                <Route exact path="/recipes/:id/edit" component={EditRecipePage} />
                <Route exact path="/recipes/:id" component={RecipeDetailPage} />

                {/* Start page */}
                <Route exact path="/">
                  {onboardingCompleted ? (
                      <Redirect to="/login" />
                  ) : (
                      <Redirect to="/welcome" />
                  )}
                </Route>
              </Switch>
            </IonRouterOutlet>

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