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

export default function LoginPage() {
    const router = useIonRouter();
    const [present] = useIonToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        router.push('/home', 'forward');
    };

    const continueAsGuest = () => {
        localStorage.setItem('userRole', 'guest');
        router.push('/home', 'forward');
    };

    return (
        <IonPage>
            <PageHeader title="Profil" />

            <IonContent className="ion-padding">
                <main style={{ maxWidth: '560px', margin: '48px auto' }}>
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

                    <p>Mit einem Gastkonto stehen nur eingeschränkte Funktionen zur Verfügung.</p>
                </main>
            </IonContent>
        </IonPage>
    );
}