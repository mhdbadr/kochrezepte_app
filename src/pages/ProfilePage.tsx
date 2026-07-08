import {
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonPage,
    useIonToast,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useIonRouter } from '@ionic/react';
// Stift Symbol.
import { createOutline } from 'ionicons/icons';

import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabaseClient';
import './ProfilePage.css';

interface ProfilePageProps {
    setIsLoggedIn: (value: boolean) => void;
    setAppUserRole: (value: string | null) => void;
}

export default function ProfilePage({
                                        setIsLoggedIn,
                                        setAppUserRole,
                                    }: ProfilePageProps) {
    const router = useIonRouter();
    const [present] = useIonToast();

    const [userRole, setUserRole] = useState<string | null>(
        localStorage.getItem('userRole')
    );

    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadUser() {
            if (userRole !== 'user') return;

            const { data } = await supabase.auth.getUser();

            if (data.user) {
                setCurrentUserEmail(data.user.email ?? null);
                setUsername(data.user.user_metadata?.username ?? '');
                setAvatarUrl(data.user.user_metadata?.avatarUrl ?? '');
            }
        }

        loadUser();
    }, [userRole]);

    const logout = async () => {
        await supabase.auth.signOut();

        localStorage.removeItem('userRole');
        setUserRole(null);
        setCurrentUserEmail(null);
        setIsLoggedIn(false);
        setAppUserRole(null);

        router.push('/login', 'root', 'replace');
    };

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
        // take first selected file
        const file = event.target.files?.[0];
        // if no file is selected, return
        if (!file) return;

        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) {
            present('Kein Benutzer angemeldet', 2000);
            return;
        }
        // create filepath
        const filePath = `${user.id}/avatar.jpg`;
        // upload image to Supabase Storage
        // Supabase Storage ceats than publicurl
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                upsert: true,
            });

        if (uploadError) {
            present(uploadError.message, 2000);
            return;
        }
        // get publicurl from Supabase Storage
        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        const publicUrl = data.publicUrl;
        // save publicurl in supabase
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
                                                onIonInput={(e) =>
                                                    setUsername(e.detail.value ?? '')
                                                }
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
                                    <span className="profile-info__value">
                                        {currentUserEmail}
                                    </span>
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

                    ) : userRole === 'guest' ? (
                        <div className="profile-card">
                            <div className="profile-avatar-container">
                                <div className="profile-avatar">
                                    G
                                </div>
                            </div>

                            <h2 className="profile-title">Gastprofil</h2>
                            <p className="profile-subtitle">
                                Du bist aktuell als Gast angemeldet.
                            </p>

                            <div className="profile-info">
                                <div className="profile-info__row">
                                    <span className="profile-info__label">Benutzername</span>
                                    <span className="profile-info__value">Gast</span>
                                </div>

                                <div className="profile-info__row">
                                    <span className="profile-info__label">E-Mail</span>
                                    <span className="profile-info__value">Nicht verfügbar</span>
                                </div>

                                <div className="profile-info__row">
                                    <span className="profile-info__label">Kontotyp</span>
                                    <span className="profile-info__value">Gast</span>
                                </div>

                                <div className="profile-info__row">
                                    <span className="profile-info__label">Hinweis</span>
                                    <span className="profile-info__value">
                    Einige Funktionen sind im Gastmodus eingeschränkt.
                </span>
                                </div>
                            </div>

                            <IonButton expand="block" routerLink="/register">
                                Konto erstellen
                            </IonButton>

                            <IonButton expand="block" fill="outline" routerLink="/login">
                                Anmelden
                            </IonButton>

                            <IonButton
                                expand="block"
                                color="danger"
                                fill="clear"
                                onClick={logout}
                            >
                                Gastmodus verlassen
                            </IonButton>
                        </div>
                    ) : (
                        <div className="profile-card">
                            <h2 className="profile-title">Nicht angemeldet</h2>
                            <p className="profile-subtitle">
                                Bitte melde dich an oder erstelle ein Konto.
                            </p>

                            <IonButton expand="block" routerLink="/login">
                                Anmelden
                            </IonButton>

                            <IonButton expand="block" fill="outline" routerLink="/register">
                                Registrieren
                            </IonButton>
                        </div>
                    )}
                </main>
            </IonContent>
        </IonPage>
    );
}