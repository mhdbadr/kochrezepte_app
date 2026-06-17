import React, { useState } from 'react';
import {
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonText,
    useIonToast,
} from '@ionic/react';
import { send, trashOutline } from 'ionicons/icons';
import { useComments } from '../hooks/useComments';
import { isGuest } from '../utils/auth';

interface CommentSectionProps {
  recipeId: string;
}

export default function CommentSection({ recipeId }: CommentSectionProps) {
  const { comments, currentUserId, addComment, deleteComment, isLoading, errorMessage } = useComments(recipeId);
  const [inputText, setInputText] = useState<string>('');
    const [present] = useIonToast();


  async function handleSendComment() {
    if (!inputText.trim()) return;

      if (isGuest()) {
          present('Bitte melde dich an, um Kommentare zu schreiben.', 2000);
          return;
      }

    await addComment(inputText.trim());
    setInputText('');
  }

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ color: 'var(--app-text)', fontWeight: 600, marginBottom: '16px' }}>
        Kommentare ({comments.length})
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <IonInput
          placeholder="Schreibe einen Kommentar..."
          value={inputText}
          onIonInput={(event) => setInputText(event.detail.value || '')}
          style={{
            background: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '8px 16px',
            '--background': 'transparent',
          }}
        />
        <IonButton fill="clear" onClick={handleSendComment} disabled={!inputText.trim()}>
          <IonIcon slot="icon-only" icon={send} color="primary" />
        </IonButton>
      </div>

      {isLoading && (
        <IonText color="medium">
          <p>Kommentare werden geladen...</p>
        </IonText>
      )}

      {errorMessage && (
        <IonText color="danger">
          <p>{errorMessage}</p>
        </IonText>
      )}

      <IonList lines="none" style={{ background: 'transparent' }}>
        {comments.map((comment) => (
          <IonItem
            key={comment.id}
            style={{
              '--background': '#ffffff',
              marginBottom: '12px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            }}
          >
            <IonLabel className="ion-text-wrap" style={{ padding: '8px 0' }}>
              <p style={{ color: 'var(--app-text)', fontSize: '0.95rem', margin: '0 0 4px' }}>
                {comment.text}
              </p>
              <IonNote style={{ fontSize: '0.75rem' }}>{comment.createdAt}</IonNote>
            </IonLabel>

            {/* Only the comment owner can delete their own comment. */}
            {comment.userId === currentUserId && (
              <IonButton fill="clear" color="danger" onClick={() => deleteComment(comment.id)}>
                <IonIcon slot="icon-only" icon={trashOutline} />
              </IonButton>
            )}
          </IonItem>
        ))}
      </IonList>
    </div>
  );
}
