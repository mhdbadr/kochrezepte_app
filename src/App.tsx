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

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import Wochenplaner from './pages/Wochenplaner';
import FavoritesPage from './pages/FavoritesPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import OnboardingPage from './pages/OnboardingPage';

setupIonicReact();

function MainTabs() {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/home" component={HomePage} />
                <Route exact path="/search" component={SearchPage} />
                <Route exact path="/planner" component={Wochenplaner} />
                <Route exact path="/favorites" component={FavoritesPage} />
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
    );
}

export default function App() {
    return (
        <IonApp>
            <IonReactRouter>
                <Switch>
                    <Route exact path="/welcome" component={WelcomePage} />
                    <Route exact path="/onboarding" component={OnboardingPage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />

                    <Route path={['/home', '/search', '/planner', '/favorites']}>
                        <MainTabs />
                    </Route>

                    <Route exact path="/">
                        <Redirect to="/welcome" />
                    </Route>
                </Switch>
            </IonReactRouter>
        </IonApp>
    );
}