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
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
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

  const [isLoggedIn, setIsLoggedIn] = useState(
      localStorage.getItem('userRole') !== null
  );

  const [userRole, setUserRole] = useState<string | null>(
      localStorage.getItem('userRole')
  );

  return (
      <IonApp>
        <IonReactRouter>
          <AppRoutes
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              userRole={userRole}
              setUserRole={setUserRole}
              onboardingCompleted={onboardingCompleted}
          />
        </IonReactRouter>
      </IonApp>
  );
}

  interface AppRoutesProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    userRole: string | null;
    setUserRole: (value: string | null) => void;
    onboardingCompleted: boolean;
  }

  function AppRoutes({
                       isLoggedIn,
                       setIsLoggedIn,
                       userRole,
                       setUserRole,
                       onboardingCompleted
                     }: AppRoutesProps) {
    const location = useLocation();

    const isAppAccessAllowed = userRole !== null;

    const hideNavigation =
        location.pathname === '/welcome' ||
        location.pathname === '/onboarding';
  return (
      <>
          <IonMenu
              contentId="main-content"
              side="start"
              menuId="main-menu"
              className="app-menu"
              disabled={!isAppAccessAllowed || hideNavigation}
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
                <Route exact path="/login">
                  <LoginPage
                      setIsLoggedIn={setIsLoggedIn}
                      setAppUserRole={setUserRole}
                  />
                </Route>
                <Route exact path="/register" component={RegisterPage} />

                {/* Main pages */}
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


                {/* Recipe pages */}
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

                {/* Start page */}
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
          {!hideNavigation && (
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
          )}
          </IonTabs>

      </>
  );
}