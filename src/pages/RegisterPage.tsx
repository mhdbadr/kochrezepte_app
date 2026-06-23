import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonPage,
    useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { useIonRouter } from '@ionic/react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabaseClient';

export default function RegisterPage() {
    const router = useIonRouter();
    const [present] = useIonToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const register = async () => {
        if (password !== confirmPassword) {
            present('Passwörter stimmen nicht überein', 2000);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        console.log('Register data:', data);
        console.log('Register error:', error);

        if (error) {
            present(error.message, 2000);
            return;
        }

        present('Registrierung erfolgreich', 2000);
        router.push('/login', 'forward');
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