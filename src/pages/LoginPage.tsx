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
import { useEffect,useRef, useState } from 'react';
import './LoginPage.css'
import { createOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';


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
    const [username, setUsername] = useState('');


    const [avatarUrl, setAvatarUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditingName, setIsEditingName] = useState(false);

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
                setUsername(data.user.user_metadata?.username ?? '');
                setAvatarUrl(data.user.user_metadata?.avatarUrl ?? '');
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


    const updateUsername = async () => {
        const { error } = await supabase.auth.updateUser({
            data: {
                username: username,
            },
        });

        if (error) {
            present(error.message, 2000);
            return;
        }

        present('Name wurde gespeichert', 2000);
    };


    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) {
            present('Kein Benutzer angemeldet', 2000);
            return;
        }

        const filePath = `${user.id}/avatar.jpg`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                upsert: true,
            });

        if (uploadError) {
            present(uploadError.message, 2000);
            return;
        }

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        const publicUrl = data.publicUrl;

        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                username,
                avatarUrl: publicUrl,
            },
        });

        if (updateError) {
            present(updateError.message, 2000);
            return;
        }

        setAvatarUrl(publicUrl);
        present('Profilbild wurde gespeichert', 2000);
    };



    return (
        <IonPage>
            <PageHeader title="Profil" />

            <IonContent className="ion-padding">
                <main className="profile-page">
                    {userRole === 'user' && currentUserEmail ? (
                        <>


                            <div className="profile-card">

                                <div className="profile-avatar-container">
                                    <div className="profile-avatar">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profilbild" />
                                        ) : (
                                            username.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        ref={fileInputRef}
                                        onChange={uploadAvatar}
                                    />

                                    <div
                                        className="edit-avatar-button"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <IonIcon icon={createOutline} />
                                    </div>
                                </div>
                                <h2 className="profile-title">Profil</h2>
                                <p className="profile-subtitle">Du bist angemeldet.</p>

                                <div className="profile-info">
                                    <div className="profile-info__row">
                                        <span className="profile-info__label">Benutzername</span>

                                        {!isEditingName ? (
                                            <div className="username-row">
                                                <span className="profile-info__value">{username}</span>

                                                <IonIcon
                                                    icon={createOutline}
                                                    className="edit-username-button"
                                                    onClick={() => setIsEditingName(true)}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <IonInput
                                                    value={username}
                                                    onIonInput={(e) => setUsername(e.detail.value ?? '')}
                                                />

                                                <IonButton
                                                    size="small"
                                                    onClick={async () => {
                                                        await updateUsername();
                                                        setIsEditingName(false);
                                                    }}
                                                >
                                                    Speichern
                                                </IonButton>
                                            </>
                                        )}
                                    </div>

                                    <div className="profile-info__row">
                                        <span className="profile-info__label">E-Mail</span>
                                        <span className="profile-info__value">{currentUserEmail}</span>
                                    </div>

                                    <div className="profile-info__row">
                                        <span className="profile-info__label">Kontotyp</span>
                                        <span className="profile-info__value">Benutzer</span>
                                    </div>
                                </div>




                                <IonButton expand="block" color="danger" onClick={logout}>
                                    Abmelden
                                </IonButton>
                            </div>
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