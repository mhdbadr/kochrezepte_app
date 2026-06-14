/**
 * BackLink component for navigating back to a previous page.
 */

import { IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import './BackLink.css';

interface BackLinkProps {
  to: string;
  label: string;
}

/**
 * Navigates back to a specified route with a label and an icon.
 * @param to - The route to navigate back to.
 * @param label - The text label displayed next to the back icon.
 * @returns A Link component styled as a back button.
 */
export default function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link className="app-back-link" to={to}>
      <IonIcon icon={chevronBackOutline} />
      <span>{label}</span>
    </Link>
  );
}
