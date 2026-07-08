/**
 * PageHeader is a component that displays the title and subtitle of a page, along with a menu button for navigation.
 */
import {
  IonAvatar,
  IonButtons,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './PageHeader.css';
import { useIonRouter } from '@ionic/react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * PageHeader component for displaying the title and subtitle of a page, along with a menu button for navigation.
 * @param title - The main title of the page.
 * @param subtitle - An optional subtitle displayed above the main title, defaulting to 'BiteBook'.
 * @returns A header component with a menu button and titles.
 */
export default function PageHeader({ title, subtitle = 'BiteBook' }: PageHeaderProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useIonRouter();

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUsername(data.user.user_metadata?.username ?? null);
        setAvatarUrl(data.user.user_metadata?.avatarUrl ?? null);
      } else {
        setUsername(null);
        setAvatarUrl(null);
      }

    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUsername(session.user.user_metadata?.username ?? null);
        setAvatarUrl(session.user.user_metadata?.avatarUrl ?? null);
      } else {
        setUsername(null);
        setAvatarUrl(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <IonHeader className="page-header">
      <IonToolbar>
        {/* The menu button opens secondary actions without duplicating the bottom tab navigation. */}
        <IonButtons slot="start">
          <IonMenuButton className="page-header__menu-button" />
        </IonButtons>

        <IonTitle>
          <span className="page-header__subtitle">{subtitle}</span>
          <span className="page-header__title">{title}</span>
        </IonTitle>

        {username && (
            <IonButtons
                slot="end"
                className="header-profile"
                onClick={() => router.push('/profile', 'forward')}
            >
              <IonAvatar className="header-avatar">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="Profilbild" />
                ) : (
                    username.charAt(0).toUpperCase()
                )}
              </IonAvatar>
            </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
}
