import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import EditRecipePage from './pages/EditRecipePage';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeForm from './pages/RecipeForm';
import RecipeListPage from './pages/RecipeListPage';

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/recipes" component={RecipeListPage} />
            {/* Specific routes must be checked before dynamic string ID routes. */}
            <Route exact path="/recipes/new" component={RecipeForm} />
            <Route exact path="/recipes/:id/edit" component={EditRecipePage} />
            <Route exact path="/recipes/:id" component={RecipeDetailPage} />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
