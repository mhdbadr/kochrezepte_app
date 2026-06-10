import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    setupIonicReact,
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import {
    calendarOutline,
    heartOutline,
    homeOutline,
    searchOutline,
} from 'ionicons/icons';

import EditRecipePage from './pages/EditRecipePage';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeForm from './pages/RecipeForm';
import RecipeListPage from './pages/RecipeListPage';
import SearchPage from './pages/SearchPage';
import Wochenplaner from './pages/Wochenplaner';

setupIonicReact();

export default function App() {
    return (
        <IonApp>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Switch>
                            <Route exact path="/home" component={HomePage} />
                            <Route exact path="/search" component={SearchPage} />
                            <Route exact path="/planner" component={Wochenplaner} />
                            <Route exact path="/favorites" component={FavoritesPage} />
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

                    <IonTabBar slot="bottom">
                        <IonTabButton tab="home" href="/home">
                            <IonIcon icon={homeOutline} />
                            <IonLabel>Home</IonLabel>
                        </IonTabButton>

                        <IonTabButton tab="search" href="/search">
                            <IonIcon icon={searchOutline} />
                            <IonLabel>Suche</IonLabel>
                        </IonTabButton>

                        <IonTabButton tab="planner" href="/planner">
                            <IonIcon icon={calendarOutline} />
                            <IonLabel>Planer</IonLabel>
                        </IonTabButton>

                        <IonTabButton tab="favorites" href="/favorites">
                            <IonIcon icon={heartOutline} />
                            <IonLabel>Kochbuch</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </IonApp>
    );
}
