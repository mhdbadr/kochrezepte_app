import { Link } from 'react-router-dom';
import './RecipeCard.css';
import FavoriteButton from './FavoriteButton';
import ShareButton from './ShareButton';

interface RecipeCardProps {
    id: string;
    title: string;
    imageUrl: string;
    duration: number;
    difficulty: string;
    category: string;
    rating?: number;
    compact?: boolean; // When true, the card is rendered in a more compact style
    to?: string; // Optional URL to navigate to when the card is clicked. If not provided, the card is rendered as plain content.
    isFavorite?: boolean; // Optional controlled favorite state for pages that manage favorites directly.
    onFavoriteToggle?: (recipeId: string) => void; // Optional callback used before the favorite state changes.
}

export default function RecipeCard({
                                       id,
                                       title,
                                       imageUrl,
                                       duration,
                                       difficulty,
                                       category,
                                       rating = 0,
                                       compact = false,
                                       to,
                                       isFavorite,
                                       onFavoriteToggle
                                   }: RecipeCardProps) {


    const handleActionClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Build the card once so it can be rendered either as plain content or as a link.
    const card = (
        <article className={`recipe-card ${compact ? 'recipe-card--compact' : ''}`}>
            <img className="recipe-card__image" src={imageUrl} alt={title} />

            <div className="recipe-card__content">
                <p className="recipe-card__category">{typeof category === 'object' && category !== null ? (category as any).name : String(category)}</p>
                <h2 className="recipe-card__title">{title}</h2>

                <p className="recipe-card__meta">
                    {duration} Min • {difficulty}
                </p>

                <div className="recipe-card__footer">
                    <div className="recipe-card__rating-display">
                        <span className="recipe-card__star">⭐</span>
                        <span className="recipe-card__rating-value">
                            {rating ? rating.toFixed(1) : '0.0'}
                        </span>
                    </div>

                    <div className="recipe-card__actions" onClick={handleActionClick}>
                        <ShareButton recipeTitle={title} recipeId={id} />
                        <FavoriteButton

                            recipeId={id}
                            isFavoriteOverride={isFavorite}
                            onToggle={onFavoriteToggle}
                        />
                    </div>
                </div>
            </div>
        </article>
    );

    if (!to) return card; // If no target URL is provided, render the card as plain content.

    // When a target URL is provided, the whole card becomes clickable.
    return (
        <Link className="recipe-card-link" to={to}>
            {card}
        </Link>
    );
}