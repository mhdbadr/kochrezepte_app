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
import { Redirect, Route } from 'react-router-dom';

import {
    homeOutline,
    searchOutline,
    calendarOutline,
    heartOutline,
} from 'ionicons/icons';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import Wochenplaner from './pages/Wochenplaner';

setupIonicReact();

export default function App() {
    return (
        <IonApp>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route exact path="/home" component={HomePage} />
                        <Route exact path="/search" component={SearchPage} />
                        <Route exact path="/planner" component={Wochenplaner} />
                        <Route exact path="/favorites" component={FavoritesPage} />

                        <Route exact path="/">
                            <Redirect to="/home" />
                        </Route>
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