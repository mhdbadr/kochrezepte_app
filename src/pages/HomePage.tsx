import './HomePage.css';
import FavoriteButton from '../components/FavoriteButton';
import RatingComponent from '../components/RatingComponent';
import { useRatings } from '../hooks/useRatings';
import CommentSection from '../components/CommentSection';
import ShareButton from '../components/ShareButton';

export default function HomePage() {
  const { saveRating, getRecipeRating } = useRatings();
  
  const testRecipeId = "1";
  const currentRating = getRecipeRating(testRecipeId);
  const testRecipeTitle = "Tomato Basil Pasta";
  return (
    <main className="home-page">
      <section className="home-card">
        <p className="home-label">Kochrezepte App</p>
        <h1>Basic App Structure</h1>
        <p className="home-text">
          This is the initial project foundation. Features will be implemented in separate issues.
        </p>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <div>
            <p className="home-label">Favorit</p>
            <FavoriteButton recipeId={testRecipeId} />
          </div>
          <div>
            <p className="home-label">Teilen</p>
            <ShareButton recipeTitle={testRecipeTitle} recipeId={testRecipeId} />
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p className="home-label">Rezept bewerten:</p>
          <RatingComponent 
            key={currentRating}
            initialRating={currentRating}
            onRatingChange={(newRating) => saveRating(testRecipeId, newRating)}
          />
        </div>
        <CommentSection recipeId={testRecipeId}/>
      </section>
    </main>
  );
}
