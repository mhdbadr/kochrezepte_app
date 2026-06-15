import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact, } from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import { calendarOutline, heartOutline, homeOutline, searchOutline, } from 'ionicons/icons';

// Importing all page components used in the app's routing configuration.
import EditRecipePage from './pages/EditRecipePage';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeForm from './pages/RecipeForm';
import RecipeListPage from './pages/RecipeListPage';
import SearchPage from './pages/SearchPage';
import Wochenplaner from './pages/Wochenplaner';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from "./pages/WelcomePage";
import OnboardingPage from "./pages/OnboardingPage";

setupIonicReact(); // Initialize Ionic React with default settings.

export default function App() {
    return (
        <IonApp>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Switch>
                            {/* Main app routes provided by the navigation/search epic. */}
                            <Route exact path="/login" component={LoginPage} />
                            <Route exact path="/register" component={RegisterPage} />
                            <Route exact path="/welcome" component={WelcomePage} />
                            <Route exact path="/onboarding" component={OnboardingPage} />

                            <Route exact path="/home" component={HomePage} />
                            <Route exact path="/search" component={SearchPage} />
                            <Route exact path="/planner" component={Wochenplaner} />
                            <Route exact path="/favorites" component={FavoritesPage} />

                            {/* Recipe core routes for listing, creating, editing, and viewing recipes. */}
                            <Route exact path="/recipes" component={RecipeListPage} />
                            {/* Specific recipe routes must be checked before dynamic string ID routes. */}
                            <Route exact path="/recipes/new" component={RecipeForm} />
                            <Route exact path="/recipes/:id/edit" component={EditRecipePage} />
                            <Route exact path="/recipes/:id" component={RecipeDetailPage} />
                            <Route exact path="/">
                                <Redirect to="/welcome" />
                            </Route>
                        </Switch>
                    </IonRouterOutlet>

                    {/* The tab bar is placed outside the router outlet to ensure it remains visible across all routes. */}
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="home" href="/home">
                            <IonIcon icon={homeOutline} />
                            <IonLabel>Home</IonLabel>
                        </IonTabButton>

                        <IonTabButton tab="search" href="/search">
                            <IonIcon icon={searchOutline} />
                            <IonLabel>Search</IonLabel>
                        </IonTabButton>

                        <IonTabButton tab="planner" href="/planner">
                            <IonIcon icon={calendarOutline} />
                            <IonLabel>Planer</IonLabel>
                        </IonTabButton>

                        <IonTabButton tab="favorites" href="/favorites">
                            <IonIcon icon={heartOutline} />
                            <IonLabel>Favorites</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </IonApp>
    );
}
