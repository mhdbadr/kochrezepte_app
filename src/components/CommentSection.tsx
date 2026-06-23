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
import './CommentSection.css';

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
        <div className="comment-section">
            <h3 className="comment-section__title">
                Kommentare ({comments.length})
            </h3>

            <div className="comment-section__composer">
                <IonInput
                    className="comment-section__input"
                    placeholder="Schreibe einen Kommentar..."
                    value={inputText}
                    onIonInput={(event) => setInputText(event.detail.value || '')}
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

            <IonList className="comment-section__list" lines="none">
                {comments.map((comment) => (
                    <IonItem
                        key={comment.id}
                        className="comment-section__item"
                    >
                        <IonLabel className="comment-section__label ion-text-wrap">
                            <p className="comment-section__text">
                                {comment.text}
                            </p>
                            <IonNote className="comment-section__note">{comment.createdAt}</IonNote>
                        </IonLabel>

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