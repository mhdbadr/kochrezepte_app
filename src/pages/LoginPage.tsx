import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonPage,
    useIonToast,
} from '@ionic/react';

import { useIonRouter } from '@ionic/react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

interface LoginPageProps {
    setIsLoggedIn: (value: boolean) => void;
    setAppUserRole: (value: string | null) => void;
}

export default function LoginPage({ setIsLoggedIn, setAppUserRole }: LoginPageProps) {
    const router = useIonRouter();
    const [present] = useIonToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    const login = async () => {

        if (!email || !password) {
            present('Bitte E-Mail und Passwort eingeben', 2000);
            return;
        }

        const { data,error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        console.log(data);
        console.log(error);

        if (error) {
            present(error.message, 2000);
            return;
        }

        localStorage.setItem('userRole', 'user');
        setIsLoggedIn(true);
        setUserRole('user');
        setAppUserRole('user');
        router.push('/home', 'root');
    };

    const continueAsGuest = () => {
        localStorage.setItem('userRole', 'guest');
        setCurrentUserEmail(null);
        setUserRole('guest');
        setIsLoggedIn(true);
        setAppUserRole('guest');
        router.push('/home', 'root');
    };

    useEffect(() => {
        async function loadUser() {
            const { data } = await supabase.auth.getUser();

            if (data.user) {
                setCurrentUserEmail(data.user.email ?? null);
            }
        }

        loadUser();
    }, []);
// Logout Funktion
    const logout = async () => {
        await supabase.auth.signOut();

        localStorage.removeItem('userRole');
        setCurrentUserEmail(null);
        setUserRole(null);
        setIsLoggedIn(false);
        setAppUserRole(null);

        router.push('/login', 'root');
    };

    const [userRole, setUserRole] = useState<string | null>(
        localStorage.getItem('userRole')
    );


    return (
        <IonPage>
            <PageHeader title="Profil" />

            <IonContent className="ion-padding">
                <main style={{ maxWidth: '560px', margin: '48px auto' }}>
                    {userRole === 'user' && currentUserEmail ? (
                        <>
                            <h2>Profil</h2>

                            <p><strong>Benutzername:</strong> {currentUserEmail.split('@')[0]}</p>
                            <p><strong>E-Mail:</strong> {currentUserEmail}</p>
                            <p><strong>Typ:</strong> Benutzer</p>

                            <IonButton color="danger" fill="solid" onClick={logout}>
                                Abmelden
                            </IonButton>
                        </>
                    ) : userRole === 'guest' ? (
                        <>
                            <h2>Gastmodus</h2>

                            <p>
                                Du nutzt die App aktuell als Gast. Einige Funktionen wie Favoriten,
                                Bewertungen, Kommentare und eigene Rezepte sind eingeschränkt.
                            </p>

                            <IonButton expand="block" onClick={logout}>
                                Anmelden
                            </IonButton>

                            <IonButton expand="block" fill="clear" routerLink="/register">
                                Konto erstellen
                            </IonButton>

                            <IonButton expand="block" fill="clear" routerLink="/home">
                                Zur Startseite
                            </IonButton>
                        </>
                    ) : (
                        <>
                            <h2>Anmelden</h2>

                            <IonItem>
                                <IonInput
                                    label="E-Mail"
                                    type="email"
                                    placeholder="name@email.de"
                                    value={email}
                                    onIonInput={(e) => setEmail(e.detail.value ?? '')}
                                />
                            </IonItem>

                            <IonItem>
                                <IonInput
                                    label="Passwort"
                                    type="password"
                                    value={password}
                                    onIonInput={(e) => setPassword(e.detail.value ?? '')}
                                />
                            </IonItem>

                            <IonButton expand="block" onClick={login}>
                                Anmelden
                            </IonButton>

                            <IonButton expand="block" fill="clear" routerLink="/register">
                                Registrieren
                            </IonButton>

                            <IonButton expand="block" fill="clear" color="medium" onClick={continueAsGuest}>
                                Als Gast fortfahren
                            </IonButton>
                        </>
                    )}
                </main>
            </IonContent>
        </IonPage>
    );
}