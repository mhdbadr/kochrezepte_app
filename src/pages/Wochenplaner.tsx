import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonText, IonGrid,
    IonRow, IonCol, IonButton, IonIcon, IonModal, IonList, IonItem,
    IonLabel, IonThumbnail, useIonViewWillEnter
} from '@ionic/react';
import { addOutline, closeOutline } from 'ionicons/icons';
import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import type { Recipe } from '../models/Recipe';
import { getAllRecipes } from '../repositories/recipeRepository';
import { getPlannerEntries, addRecipeToPlanner } from '../repositories/plannerRepository';

const DAYS_OF_WEEK = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

interface WeeklyPlan {
    [key: string]: Recipe[];
}

export default function PlannerPage() {
    const [plan, setPlan] = useState<WeeklyPlan>({
        'Montag': [], 'Dienstag': [], 'Mittwoch': [], 'Donnerstag': [], 'Freitag': [], 'Samstag': [], 'Sonntag': [],
    });
    
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeDay, setActiveDay] = useState<string | null>(null);

    // Lädt den Planer über euer neues Repository
    const loadPlanner = async () => {
        try {
            const entries = await getPlannerEntries();
            
            const newPlan: WeeklyPlan = {
                'Montag': [], 'Dienstag': [], 'Mittwoch': [], 'Donnerstag': [], 'Freitag': [], 'Samstag': [], 'Sonntag': [],
            };

            entries.forEach(entry => {
                if (newPlan[entry.dayOfWeek]) {
                    newPlan[entry.dayOfWeek].push(entry.recipe);
                }
            });

            setPlan(newPlan);
        } catch (err) {
            console.error(err);
        }
    };

    // Lädt alle echten Rezepte für die Auswahlliste im Modal
    const loadRecipesForModal = async () => {
        try {
            const recipes = await getAllRecipes();
            setAllRecipes(recipes);
        } catch (err) {
            console.error(err);
        }
    };

    useIonViewWillEnter(() => {
        loadPlanner();
        loadRecipesForModal();
    });

    const openPlanModal = (day: string) => {
        setActiveDay(day);
        setIsModalOpen(true);
    };

    const handleAddRecipe = async (recipeId: string) => {
        if (!activeDay) return;
        try {
            await addRecipeToPlanner(activeDay, recipeId);
            await loadPlanner(); // Aktualisiert die Ansicht sofort live
            setIsModalOpen(false);
            setActiveDay(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <IonPage>
            <IonHeader><IonToolbar><IonTitle>Wochenplaner</IonTitle></IonToolbar></IonHeader>
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        {DAYS_OF_WEEK.map((day) => {
                            const dayRecipes = plan[day] || [];
                            return (
                                <IonCol size="12" sizeMd="6" key={day}>
                                    <IonCard style={{ margin: '8px 0', borderRadius: '12px' }}>
                                        <IonCardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                                            <IonCardTitle style={{ fontSize: '1.3rem', color: 'var(--ion-color-primary)' }}>{day}</IonCardTitle>
                                            <IonButton fill="clear" size="small" onClick={() => openPlanModal(day)}>
                                                <IonIcon slot="icon-only" icon={addOutline} />
                                            </IonButton>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            {dayRecipes.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                                                    {dayRecipes.map((recipe) => (
                                                        <RecipeCard
                                                            id={recipe.id} key={recipe.id} title={recipe.title}
                                                            imageUrl={recipe.imageUrl ?? ''} duration={recipe.preparationTime}
                                                            difficulty="Einfach" category={recipe.category} rating={recipe.rating}
                                                            compact={true} to={`/recipes/${recipe.id}`}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <IonText color="medium">
                                                    <p style={{ fontStyle: 'italic', margin: '8px 0' }}>🍳 Noch kein Rezept geplant.</p>
                                                </IonText>
                                            )}
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                            );
                        })}
                    </IonRow>
                </IonGrid>

                <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Rezept für {activeDay} wählen</IonTitle>
                            <IonButton slot="end" fill="clear" onClick={() => setIsModalOpen(false)}>
                                <IonIcon icon={closeOutline} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonList>
                            {allRecipes.map((recipe) => (
                                <IonItem button key={recipe.id} onClick={() => handleAddRecipe(recipe.id)}>
                                    <IonThumbnail slot="start">
                                        <img src={recipe.imageUrl ?? ''} alt={recipe.title} style={{ borderRadius: '6px' }} />
                                    </IonThumbnail>
                                    <IonLabel>
                                        <h2>{recipe.title}</h2>
                                        <p>{recipe.category} • {recipe.preparationTime} Min</p>
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
}