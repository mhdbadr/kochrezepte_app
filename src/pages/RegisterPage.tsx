import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonPage,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useIonRouter } from '@ionic/react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabaseClient';
import { useFeedbackToast } from '../hooks/useFeedbackToast';

interface RegisterPageProps {
    setIsLoggedIn: (value: boolean) => void;
    setAppUserRole: (value: string | null) => void;
}

export default function RegisterPage({setIsLoggedIn,setAppUserRole,}: RegisterPageProps) {
    const router = useIonRouter();
    const { showValidationToast, showErrorToast, showSuccessToast, showInfoToast } = useFeedbackToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');

    const usernameInputRef = useRef<HTMLIonInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            usernameInputRef.current?.setFocus();
        }, 300);
    }, []);
    const register = async () => {
        if (!username || !email || !password || !confirmPassword) {
            showValidationToast('Bitte alle Felder ausfuellen');
            return;
        }

        if (password !== confirmPassword) {
            showValidationToast('Passwoerter stimmen nicht ueberein');
            return;
        }


        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                },
            },
        });

        if (error) {
            showErrorToast(error.message);
            return;
        }




        if (data.session) {
            localStorage.setItem('userRole', 'user');
            setIsLoggedIn(true);
            setAppUserRole('user');

            showSuccessToast('Registrierung erfolgreich.');

            window.location.replace('/home');

            return;
        }

        showInfoToast('Registrierung erfolgreich. Bitte anmelden.');

        router.push('/login', 'root');
    };

    return (
        <IonPage>
            <PageHeader title="Registrieren" />

            <IonContent className="ion-padding">
                <main style={{ maxWidth: '560px', margin: '48px auto' }}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            register();
                        }}
                    >

                    <IonItem>
                        <IonInput
                            ref={usernameInputRef}
                            label="Benutzername"
                            type="text"
                            placeholder="Dein Name"
                            value={username}
                            onIonInput={(e) => setUsername(e.detail.value ?? '')}
                        />
                    </IonItem>

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

                    <IonItem>
                        <IonInput
                            label="Passwort wiederholen"
                            type="password"
                            value={confirmPassword}
                            onIonInput={(e) => setConfirmPassword(e.detail.value ?? '')}
                        />
                    </IonItem>

                        <IonButton expand="block" type="submit">
                            Registrieren
                        </IonButton>

                </form>
                    <IonButton expand="block" fill="clear" routerLink="/login">
                        Zur Anmeldung
                    </IonButton>
                </main>
            </IonContent>
        </IonPage>
    );
}

