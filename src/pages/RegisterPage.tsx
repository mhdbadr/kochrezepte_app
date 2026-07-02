import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonPage,
    useIonToast,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useIonRouter } from '@ionic/react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabaseClient';

interface RegisterPageProps {
    setIsLoggedIn: (value: boolean) => void;
    setAppUserRole: (value: string | null) => void;
}

export default function RegisterPage({setIsLoggedIn,setAppUserRole,}: RegisterPageProps) {
    const router = useIonRouter();
    const [present] = useIonToast();

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
            present({
                message: 'Bitte alle Felder ausfüllen',
                duration: 2000,
                position: 'middle',
                color: 'danger',
            });
            return;
        }

        if (password !== confirmPassword) {
            present({
                message: 'Passwörter stimmen nicht überein',
                duration: 2000,
                position: 'middle',
                color: 'danger',
            });
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
            present({
                message: error.message,
                duration: 2500,
                color: 'danger',
            });
            return;
        }




        if (data.session) {
            localStorage.setItem('userRole', 'user');
            setIsLoggedIn(true);
            setAppUserRole('user');

            present({
                message: 'Registrierung erfolgreich.',
                duration: 2000,
                color: 'success',
            });

            window.location.replace('/home');

            return;
        }

        present({
            message: 'Registrierung erfolgreich. Bitte anmelden.',
            duration: 2500,
            color: 'warning',
        });

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