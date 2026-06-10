import './HomePage.css';
import FavoriteButton from '../components/FavoriteButton';
import RatingComponent from '../components/RatingComponent';

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-card">
        <p className="home-label">Kochrezepte App</p>
        <h1>Basic App Structure</h1>
        <p className="home-text">
          This is the initial project foundation. Features will be implemented in separate issues.
        </p>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p className="home-label">Dein Favorite Button Test:</p>
          <FavoriteButton  recipeId="1"/>
        </div>
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p className="home-label">Rezept bewerten:</p>
          <RatingComponent 
            initialRating={0} 
            onRatingChange={(newRating) => console.log('Neue Bewertung abgegeben:', newRating)} 
          />
        </div>

      </section>
    </main>
  );
}
