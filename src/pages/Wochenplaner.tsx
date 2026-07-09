import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonText, IonGrid,
    IonRow, IonCol, IonButton, IonIcon, IonModal, IonList, IonItem,
    IonLabel, IonThumbnail, useIonViewWillEnter,IonSearchbar,IonAlert,IonFab, IonFabButton,
} from '@ionic/react';
import { addOutline, closeOutline,trashOutline,cartOutline } from 'ionicons/icons';
import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import './Wochenplaner.css';
import PageHeader from '../components/PageHeader'; 
import type { Recipe } from '../models/Recipe';
import { getAllRecipes } from '../repositories/recipeRepository';
import { getPlannerEntries, addRecipeToPlanner,removeRecipeFromPlanner } from '../repositories/plannerRepository';
import { isGuest } from '../utils/auth';


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
    const dynamicDays = getNextSevenDays();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [recipeToRemove, setRecipeToRemove] = useState<{ day: string; recipeId: string } | null>(null);
    

    const filteredRecipes = allRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.category && recipe.category.toLowerCase().includes(searchQuery.toLowerCase()))
);


    /**
     * Fetches all planned meals from the repository and structures them by weekday.
     */
    const loadPlanner = async () => {

        if (isGuest()) return;

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

    /**
     * Loads all available recipes from the database to display them inside the selection modal.
     */
    const loadRecipesForModal = async () => {
        try {
            const recipes = await getAllRecipes();
            setAllRecipes(recipes);
        } catch (err) {
            console.error(err);
        }
    };
    // Automatically refresh data whenever the user enters the planner view
    useIonViewWillEnter(() => {
        loadPlanner();
        loadRecipesForModal();
    });

    /**
     * Opens the recipe selection modal for a specific day.
     * @param day The weekday string (e.g., 'Montag')
     */
    const openPlanModal = (day: string) => {
        setActiveDay(day);
        setIsModalOpen(true);
    };

    /**
     * Links a selected recipe to the active weekday in the database and refreshes the UI.
     * @param recipeId The unique identifier of the recipe
     */
    const handleAddRecipe = async (recipeId: string) => {
        if (!activeDay) return;
        const selectedRecipe = allRecipes.find(r => r.id === recipeId);

        if (selectedRecipe) {
            
            setPlan(prevPlan => ({
                ...prevPlan,
                [activeDay]: [...(prevPlan[activeDay] || []), selectedRecipe]
            }));
        }
        setIsModalOpen(false);
        setActiveDay(null);
        setSearchQuery('');
        try {
            addRecipeToPlanner(activeDay, recipeId).catch(err => {
                console.error("Background sync failed, rolling back...", err);
                // Rollback the UI update if the database operation fails
                loadPlanner(); 
            });
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * Generates an array of the next 7 weekdays starting from the current date.
     * @returns Array of weekday names (e.g., ['Mittwoch', 'Donnerstag', ...])
     */
    function getNextSevenDays(): string[] {
        const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        const result: string[] = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
            result.push(days[futureDate.getDay()]);
        }

        return result; 
        }

   /**
     * Triggered by the delete button. Opens the confirmation alert by setting the state.
     * @param day The weekday string
     * @param recipeId The unique identifier of the recipe to remove
     */
    const handleRemoveRecipe = (day: string, recipeId: string) => {
        setRecipeToRemove({ day, recipeId });
    };

    /**
     * Confirms the removal of the recipe from the planner database and refreshes the UI.
     * Triggered by the confirmation alert.
     */
    const confirmRemoveRecipe = async () => {
        if (!recipeToRemove) return;
        
        try {
            await removeRecipeFromPlanner(recipeToRemove.day, recipeToRemove.recipeId);
            await loadPlanner(); 
        } catch (err) {
            console.error("Error removing recipe from planner:", err);
        } finally {
            setRecipeToRemove(null); // Reset state after action
        }
    };


   return (
    <IonPage>
        <PageHeader title="Wochenplaner" />

        <IonContent fullscreen>
            <main className="planner-container">
                
                <section className="planner-hero">
                    <p>Wochenplanung</p>
                    <h1>Dein Wochenplaner</h1>
                    <span>
                        Plane deine Mahlzeiten für die Woche und generiere deine Einkaufsliste.
                    </span>
                </section>
                {/* Show a friendly notice if the user is a guest using a clean CSS class */}
                {isGuest() && (
                    <div className="planner-guest-banner">
                         Du bist als Gast angemeldet. Bitte melde dich an, um deinen persönlichen Wochenplaner zu nutzen!
                    </div>
                )}
                <IonGrid style={{ padding: 0 }}>
                    <IonRow>
                        {dynamicDays.map((day) => {
                            const dayRecipes = plan[day] || [];
                            return (
                                <IonCol size="12" size-md="6" size-xl="4" key={day}>
                                    <IonCard className="day-card" style={{ height: 'calc(100% - 24px)', margin: '12px 0' }}>
                                        <IonCardHeader style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                                            <IonCardTitle style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--ion-color-primary)' }}>{day}</IonCardTitle>

                                            {/* Only show the add button if the user is NOT a guest */}
                                                {!isGuest() && (
                                                    <IonButton fill="clear" size="small" onClick={() => openPlanModal(day)}>
                                                        <IonIcon slot="icon-only" icon={addOutline} />
                                                    </IonButton>
                                                )}
                                        </IonCardHeader>
                                        
                                        <IonCardContent>
                                            {dayRecipes.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                                                    {dayRecipes.map((recipe,index) => (
                                                            <div key={`${recipe.id}-${index}`} className="planner-recipe-row">
                                                            
                                                                <div className="planner-recipe-card-wrapper">
                                                                    <RecipeCard
                                                                        id={recipe.id} title={recipe.title}
                                                                        imageUrl={recipe.imageUrl ?? ''} duration={recipe.preparationTime}
                                                                        difficulty="Einfach" category={recipe.category} rating={recipe.rating}
                                                                        compact={true} to={`/recipes/${recipe.id}`}
                                                                    />
                                                                </div>

                                                                    <IonButton 
                                                                        fill="clear" 
                                                                        color="danger" 
                                                                        className="planner-delete-button"
                                                                        onClick={() => handleRemoveRecipe(day, recipe.id)}
                                                                    >
                                                                        <IonIcon slot="icon-only" icon={trashOutline} />
                                                                    </IonButton>
                                                            </div>
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
                
            </main>

            <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Rezept für {activeDay} wählen</IonTitle>
                        <IonButton slot="end" fill="clear" onClick={() => setIsModalOpen(false)}>
                            <IonIcon icon={closeOutline} />
                        </IonButton>
                    </IonToolbar>
                    <IonSearchbar 
                        value={searchQuery} 
                        onIonInput={(e) => setSearchQuery(e.detail.value!)} 
                        placeholder="Nach Rezept oder Kategorie suchen..."
                        animated
                    />
                </IonHeader>
                <IonContent>
                    <IonList lines="full">
                        {filteredRecipes.map((recipe) => (
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

                        {filteredRecipes.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--ion-color-medium)' }}>
                                <p>Keine Rezepte für "{searchQuery}" gefunden.</p>
                            </div>
                        )}

                    </IonList>
                </IonContent>
            </IonModal>

            <IonAlert
                isOpen={recipeToRemove !== null}
                header="Rezept entfernen"
                message="Möchtest du dieses Rezept wirklich aus deinem Wochenplaner entfernen?"
                buttons={[
                    {
                        text: 'Abbrechen',
                        role: 'cancel',
                        handler: () => setRecipeToRemove(null),
                    },
                    {
                        text: 'Entfernen',
                        role: 'destructive',
                        handler: confirmRemoveRecipe,
                    },
                ]}
                onDidDismiss={() => setRecipeToRemove(null)}
            />

              {/* Floating Action Button navigating to the shopping list, positioned at the bottom right */}
                <IonFab slot="fixed" vertical="bottom" horizontal="end">
                <IonFabButton routerLink="/shopping-list">
                    <IonIcon icon={cartOutline} />
                </IonFabButton>
                </IonFab>
      
        </IonContent>
    </IonPage>
);
}
