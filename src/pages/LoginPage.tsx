import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonPage,
} from '@ionic/react';


import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useRef, useState } from 'react';
import './LoginPage.css';
import { useFeedbackToast } from '../hooks/useFeedbackToast';


interface LoginPageProps {
    setIsLoggedIn: (value: boolean) => void;
    setAppUserRole: (value: string | null) => void;
}

export default function LoginPage({ setIsLoggedIn, setAppUserRole }: LoginPageProps) {
    const { showValidationToast, showErrorToast } = useFeedbackToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailInputRef = useRef<HTMLIonInputElement>(null);

    useEffect(() => {
        setTimeout(() => {
            emailInputRef.current?.setFocus();
        }, 300);
    }, []);

    const login = async () => {
        if (!email || !password) {
            showValidationToast('Bitte E-Mail und Passwort eingeben');
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            showErrorToast('E-Mail oder Passwort ist falsch');
            return;
        }

        localStorage.setItem('userRole', 'user');
        setIsLoggedIn(true);
        setAppUserRole('user');

        window.location.replace('/home');
    };

    const continueAsGuest = async () => {
        await supabase.auth.signOut();

        localStorage.setItem('userRole', 'guest');
        setIsLoggedIn(true);
        setAppUserRole('guest');

        window.location.replace('/home');
    };

    return (
         <IonPage>
            <PageHeader title="Anmelden" />

            <IonContent className="ion-padding">

                <main className="login-page">
                    <div className="login-card">
                    <h2>Anmelden</h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            login();
                        }}
                    >
                        <IonItem>
                            <IonInput
                                ref={emailInputRef}
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

                        <IonButton expand="block" type="submit">
                            Anmelden
                        </IonButton>
                    </form>

                    <IonButton expand="block" fill="clear" routerLink="/register">
                        Registrieren
                    </IonButton>

                    <IonButton
                        expand="block"
                        fill="clear"
                        color="medium"
                        onClick={continueAsGuest}
                    >
                        Als Gast fortfahren
                    </IonButton>
                </div>
                </main>
            </IonContent>
        </IonPage>
    );
}
