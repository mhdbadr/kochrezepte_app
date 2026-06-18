import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonText, IonGrid,
    IonRow, IonCol, IonButton, IonIcon, IonModal, IonList, IonItem,
    IonLabel, IonThumbnail, useIonViewWillEnter,IonItemSliding, IonItemOptions, IonItemOption
} from '@ionic/react';
import { addOutline, closeOutline,trashOutline } from 'ionicons/icons';
import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import './Wochenplaner.css';
import PageHeader from '../components/PageHeader'; 
import type { Recipe } from '../models/Recipe';
import { getAllRecipes } from '../repositories/recipeRepository';
import { getPlannerEntries, addRecipeToPlanner,removeRecipeFromPlanner } from '../repositories/plannerRepository';

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
            await loadPlanner(); 
            setIsModalOpen(false);
            setActiveDay(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveRecipe = async (day: string, recipeId: string) => {
    try {
        await removeRecipeFromPlanner(day, recipeId);
        await loadPlanner(); 
    } catch (err) {
        console.error(err);
    }
};
   return (
    <IonPage>
        <PageHeader title="Wochenplaner" />

        <IonContent fullscreen className="ion-padding">
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                
                <div style={{ 
                    padding: '24px 16px', 
                    background: 'var(--ion-color-primary)', 
                    color: '#fff', 
                    borderRadius: '12px', 
                    marginBottom: '20px',
                    boxShadow: '0 4px 12px rgba(var(--ion-color-primary-rgb, 0,0,0), 0.2)'
                }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>BiteBook Core</span>
                    <h1 style={{ margin: '4px 0 6px 0', fontWeight: '800', fontSize: '1.8rem' }}>Dein Wochenplaner</h1>
                    <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9, lineHeight: '1.4' }}>
                        Plane deine Mahlzeiten für die Woche und generiere deine Einkaufsliste.
                    </p>
                </div>

                <IonGrid style={{ padding: 0 }}>
                    <IonRow>
                        {DAYS_OF_WEEK.map((day) => {
                            const dayRecipes = plan[day] || [];
                            return (
                                <IonCol size="12" key={day}>
                                    <IonCard style={{ margin: '12px 0', borderRadius: '14px', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                                        <IonCardHeader style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                                            <IonCardTitle style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--ion-color-primary)' }}>{day}</IonCardTitle>
                                            <IonButton fill="clear" size="small" onClick={() => openPlanModal(day)}>
                                                <IonIcon slot="icon-only" icon={addOutline} />
                                            </IonButton>
                                        </IonCardHeader>
                                        
                                        <IonCardContent>
                                            {dayRecipes.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                                                    {dayRecipes.map((recipe) => (
                                                        <IonItemSliding key={recipe.id}>
                                                            
                                                            <IonItem lines="none" style={{ '--background': 'transparent', '--padding-start': '0' }}>
                                                                <RecipeCard
                                                                    id={recipe.id} title={recipe.title}
                                                                    imageUrl={recipe.imageUrl ?? ''} duration={recipe.preparationTime}
                                                                    difficulty="Einfach" category={recipe.category} rating={recipe.rating}
                                                                    compact={true} to={`/recipes/${recipe.id}`}
                                                                />
                                                            </IonItem>

                                                            <IonItemOptions side="end">
                                                                <IonItemOption 
                                                                    color="danger" 
                                                                    expandable 
                                                                    onClick={() => handleRemoveRecipe(day, recipe.id)}
                                                                >
                                                                    <IonIcon slot="icon-only" icon={trashOutline} />
                                                                </IonItemOption>
                                                            </IonItemOptions>
                                                        </IonItemSliding>
                                                    ))}
                                                </div>
                                            ) : (
                                                <IonText color="medium">
                                                    <p style={{ fontStyle: 'italic', margin: '4px 0' }}>🍳 Noch kein Rezept geplant.</p>
                                                </IonText>
                                            )}
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                            );
                        })}
                    </IonRow>
                </IonGrid>
                
            </div>

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
                    <IonList lines="full">
                        {allRecipes.map((recipe) => (
                            <IonItem button key={recipe.id} onClick={() => handleAddRecipe(recipe.id)}>
                                <IonThumbnail slot="start">
                                    <img src={recipe.imageUrl ?? ''} alt={recipe.title} style={{ borderRadius: '6px' }} />
                                </IonThumbnail>
                                <IonLabel>
                                    <h2 style={{ fontWeight: '600', color: 'var(--ion-color-dark)' }}>{recipe.title}</h2>
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