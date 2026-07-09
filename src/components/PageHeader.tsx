/**
 * PageHeader is a component that displays the title and subtitle of a page, along with a menu button for navigation.
 */
import {
  
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import './PageHeader.css';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  

  return (
    <IonHeader className="page-header">
      <IonToolbar>
        {/* The menu button opens secondary actions without duplicating the bottom tab navigation. */}
        <IonButtons slot="start">
          {!isHomePage && (
            <IonButton 
              routerLink="/home" 
              routerDirection="back"
              className="page-header__back-button"
            >
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
            
          )}
        </IonButtons>

        {/* Center: Title and subtitle remain unchanged */}
        <IonTitle>
          <span className="page-header__subtitle">{subtitle}</span>
          <span className="page-header__title">{title}</span>
        </IonTitle>

        {/* Right side: Replaced the profile avatar with the Burger Menu */}
        <IonButtons slot="end">
          <IonMenuButton className="page-header__menu-button" />
        </IonButtons>
        
      </IonToolbar>
    </IonHeader>
  );
}
