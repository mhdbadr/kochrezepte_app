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
import type { ReactNode } from 'react';
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
import ProfilePage from './pages/ProfilePage';

import { supabase } from './lib/supabaseClient';
import { applyTheme, loadAppSettings } from './utils/appSettings';

import './App.css';

setupIonicReact();
// Define the type for user roles in the app. It can be 'user', 'guest', or null (no access)
type AppUserRole = 'user' | 'guest' | null;

/**
 * Retrieve the stored user role from localStorage
 */
function getStoredUserRole(): AppUserRole {
    const storedRole = localStorage.getItem('userRole');

    if (storedRole === 'user' || storedRole === 'guest') {
        return storedRole;
    }

    return null;
}

interface AppRoutesProps {
    onboardingCompleted: boolean;
    isLoggedIn: boolean;
    isAppAccessAllowed: boolean;
    setIsLoggedIn: (value: boolean) => void;
    updateAccess: (role: AppUserRole) => void;
}

function AppRoutes({
                       onboardingCompleted,
                       isLoggedIn,
                       isAppAccessAllowed,
                       setIsLoggedIn,
                       updateAccess,
                   }: AppRoutesProps) {
    const location = useLocation();

    const hideNavigation =
        location.pathname === '/welcome' ||
        location.pathname === '/onboarding' ||
        location.pathname === '/login' ||
        location.pathname === '/register';

    const setAppUserRole = (role: string | null) => {
        updateAccess(role === 'user' || role === 'guest' ? role : null);
    };
    /**
     * Protect a page by checking if the user has access to the app. If not, redirect to the login page
     * @param page - The ReactNode representing the page to protect
     */
    const protectedPage = (page: ReactNode) => {
        return isAppAccessAllowed ? page : <Redirect to="/login" />;
    };

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
                                setAppUserRole={setAppUserRole}
                            />
                        </Route>

                        <Route exact path="/register">
                            <RegisterPage
                                setIsLoggedIn={setIsLoggedIn}
                                setAppUserRole={setAppUserRole}
                            />
                        </Route>

                        <Route exact path="/profile">
                            {protectedPage(
                                <ProfilePage
                                    setIsLoggedIn={setIsLoggedIn}
                                    setAppUserRole={setAppUserRole}
                                />
                            )}
                        </Route>

                        <Route exact path="/home">
                            {protectedPage(<HomePage />)}
                        </Route>

                        <Route exact path="/search">
                            {protectedPage(<SearchPage />)}
                        </Route>

                        <Route exact path="/planner">
                            {protectedPage(<Wochenplaner />)}
                        </Route>

                        <Route exact path="/favorites">
                            {protectedPage(<FavoritesPage />)}
                        </Route>

                        <Route exact path="/shopping-list">
                            {protectedPage(<ShoppingListPage />)}
                        </Route>

                        <Route exact path="/settings">
                            {protectedPage(<SettingsPage />)}
                        </Route>

                        <Route exact path="/recipes">
                            {protectedPage(<RecipeListPage />)}
                        </Route>

                        <Route exact path="/recipes/new">
                            {protectedPage(<RecipeForm />)}
                        </Route>

                        <Route exact path="/recipes/:id/edit">
                            {protectedPage(<EditRecipePage />)}
                        </Route>

                        <Route exact path="/recipes/:id">
                            {protectedPage(<RecipeDetailPage />)}
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

                        <IonTabButton tab="profile" href="/profile" disabled={!isAppAccessAllowed}>
                            <IonIcon icon={personCircleOutline} />
                            <IonLabel>Profil</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                )}
            </IonTabs>
        </>
    );
}

export default function App() {
    const [onboardingCompleted] = useState(
        localStorage.getItem('onboardingCompleted') === 'true'
    );
    // Authentication state management
    const [userRole, setUserRole] = useState<AppUserRole>(getStoredUserRole);
    const [isLoggedIn, setIsLoggedIn] = useState(getStoredUserRole() !== null);
    // Update access state and persist it in localStorage for guest mode.
    const updateAccess = (role: AppUserRole) => {
        setUserRole(role);
        setIsLoggedIn(role !== null);

        if (role) {
            localStorage.setItem('userRole', role);
        } else {
            localStorage.removeItem('userRole');
        }
    };
    // Determine if the user has access to the app based on their role.
    const isAppAccessAllowed = userRole !== null;

    useEffect(() => {
        const updateTheme = () => applyTheme(loadAppSettings().themeMode);
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

        updateTheme();
        systemTheme.addEventListener('change', updateTheme);

        return () => systemTheme.removeEventListener('change', updateTheme);
    }, []);
    // Supabase is the source of truth for real users. localStorage is only used for guest mode.
    useEffect(() => {
        let isMounted = true;
        /**
         * Apply the session state to the app's access control.
         * @param hasSession - A boolean indicating whether a valid session exists
         */
        const applySession = (hasSession: boolean) => {
            if (hasSession) {
                updateAccess('user');
            } else if (localStorage.getItem('userRole') === 'guest') {
                updateAccess('guest');
            } else {
                updateAccess(null);
            }
        };
        /**
         * Load the current session from Supabase and apply it to the app's access control
         */
        async function loadSession() {
            try {
                const { data } = await supabase.auth.getSession();

                if (!isMounted) return;

                applySession(Boolean(data.session));
            } catch {
                if (isMounted) {
                    updateAccess(null);
                }
            }
        }
        // Listen for authentication state changes and update the app's access control accordingly
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            applySession(Boolean(session));
        });

        loadSession();

        return () => {
            isMounted = false;
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <IonApp>
            <IonReactRouter>
                <AppRoutes
                    onboardingCompleted={onboardingCompleted}
                    isLoggedIn={isLoggedIn}
                    isAppAccessAllowed={isAppAccessAllowed}
                    setIsLoggedIn={setIsLoggedIn}
                    updateAccess={updateAccess}
                />
            </IonReactRouter>
        </IonApp>
    );
}