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
    IonAlert,
} from '@ionic/react';
import { send, trashOutline } from 'ionicons/icons';
import { useComments } from '../hooks/useComments';
import { isGuest } from '../utils/auth';
import './CommentSection.css';

interface CommentSectionProps {
    recipeId: string;
}

/**
 * CommentSection Component
 * Handles displaying, adding, and deleting comments for a specific recipe.
 * Restricts guest users from writing comments using a toast notification.
 */
export default function CommentSection({ recipeId }: CommentSectionProps) {
    const { comments, currentUserId, addComment, deleteComment, isLoading, errorMessage } = useComments(recipeId);
    const [inputText, setInputText] = useState<string>('');
    const [present] = useIonToast();
    const [commentIdToDelete, setCommentIdToDelete] = useState<string | null>(null);

    /**
     * Handles the submission of a new comment.
     * Prevents empty submissions and checks if the current user is a guest.
     */
    async function handleSendComment() {
        if (!inputText.trim()) return;

        // Block guests from commenting and show a warning toast
        if (isGuest()) {
            present('Bitte melde dich an, um Kommentare zu schreiben.', 2000);
            return;
        }

        await addComment(inputText.trim());
        setInputText('');
    }

    /**
     * Confirms the deletion of the selected comment.
     * Triggered by the confirmation alert.
     */
    const confirmDeleteComment = async () => {
        if (!commentIdToDelete) return;
        
        try {
            await deleteComment(commentIdToDelete);
        } catch (error) {
            console.error("Failed to delete comment:", error);
        } finally {
            setCommentIdToDelete(null); // Reset state after action
        }
    };

    return (
        <div className="comment-section">
            <h3 className="comment-section__title">
                Kommentare ({comments.length})
            </h3>

            {/* Comment Input Composer */}
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

            {/* Loading and Error States */}
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

            {/* Comments List */}
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

                        {/* Only show the delete button if the comment belongs to the current user */}
                        {comment.userId === currentUserId && (
                            <IonButton fill="clear" color="danger" onClick={() => setCommentIdToDelete(comment.id)}>
                                <IonIcon slot="icon-only" icon={trashOutline} />
                            </IonButton>
                        )}
                    </IonItem>
                ))}
            </IonList>

            <IonAlert
                isOpen={commentIdToDelete !== null}
                header="Kommentar löschen"
                message="Möchtest du diesen Kommentar wirklich löschen?"
                buttons={[
                    {
                        text: 'Abbrechen',
                        role: 'cancel',
                        handler: () => setCommentIdToDelete(null),
                    },
                    {
                        text: 'Löschen',
                        role: 'destructive',
                        handler: confirmDeleteComment,
                    },
                ]}
                onDidDismiss={() => setCommentIdToDelete(null)}
            />
        </div>
    );
}