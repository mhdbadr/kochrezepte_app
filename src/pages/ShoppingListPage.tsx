import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonCheckbox } from '@ionic/react';
import PageHeader from '../components/PageHeader'; 
import BackLink from '../components/BackLink';   
import { buildShoppingList } from '../utils/shoppingListBuilder';
import type { ShoppingListItem } from '../models/ShoppingListItem';
import type { Recipe } from '../models/Recipe';
import { getPlannerEntries } from '../repositories/plannerRepository';


const ShoppingListPage: React.FC = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

useEffect(() => {
  const fetchPlannedRecipes = async () => {
    try {
      const entries = await getPlannerEntries();
      
      const realPlannedRecipes = entries.map(entry => entry.recipe);
      
      const generatedList = buildShoppingList(realPlannedRecipes);
      
      setShoppingList(generatedList);
    } catch (err) {
      console.error("Fehler beim Laden der Einkaufsliste:", err);
    }
  };

  fetchPlannedRecipes();
}, []); 

const toggleCheck = (index: number) => {
  const updatedList = [...shoppingList];
  updatedList[index].isChecked = !updatedList[index].isChecked;
  setShoppingList(updatedList);
};
  return (
    <IonPage>
      <PageHeader title="Einkaufsliste" />

      <IonContent fullscreen>
        <main className="recipe-form-page">
          <BackLink to="/home" label="Zurück zur Übersicht" />

          <section className="recipe-form-hero" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))' }}>
            <p>Einkaufs-Assistent</p>
            <h1>Deine Einkaufsliste</h1>
            <span>Alle benötigten Zutaten für deine geplanten Rezepte im Überblick.</span>
          </section>

          <div className="recipe-form">
            <fieldset className="recipe-form-card">
              <legend>Zutaten zum Einkaufen</legend>

              <div style={{ padding: '8px 0' }}>
                {shoppingList.map((item, index) => (
                  <div 
                    key={index} 
                    onClick={() => toggleCheck(index)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '14px 8px', 
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      opacity: item.isChecked ? 0.5 : 1,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <IonCheckbox 
                      checked={item.isChecked} 
                      slot="start" 
                      style={{ marginRight: '16px', '--size': '20px' }}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '16px', 
                        fontWeight: 500,
                        textDecoration: item.isChecked ? 'line-through' : 'none',
                        color: 'var(--ion-color-dark)'
                      }}>
                        {item.name}
                      </span>
                      <span style={{ 
                        fontSize: '14px', 
                        color: 'var(--ion-color-medium)',
                        fontWeight: 'bold',
                        backgroundColor: '#f5f5f5',
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}>
                        {item.amount > 0 ? `${item.amount} ${item.unit ?? ''}` : 'Bedarf'}
                      </span>
                    </div>
                  </div>
                ))}

                {shoppingList.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--ion-color-medium)' }}>
                    <p style={{ margin: 0, fontSize: '15px' }}>
                      Keine Zutaten auf der Liste. Plane zuerst Rezepte im Wochenplaner!
                    </p>
                  </div>
                )}
              </div>
            </fieldset>
          </div>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default ShoppingListPage;