import { Link } from 'react-router-dom';
import './RecipeCard.css';

interface RecipeCardProps {
    title: string;
    imageUrl: string;
    duration: number;
    difficulty: string;
    category: string;
    rating?: number;
    compact?: boolean;
    to?: string;
}

export default function RecipeCard({
                                       title,
                                       imageUrl,
                                       duration,
                                       difficulty,
                                       category,
                                       rating = 0,
                                       compact = false,
                                       to
                                   }: RecipeCardProps) {
    const card = (
        <article className={`recipe-card ${compact ? 'recipe-card--compact' : ''}`}>
            <img className="recipe-card__image" src={imageUrl} alt={title} />

            <div className="recipe-card__content">
                <p className="recipe-card__category">{category}</p>
                <h2 className="recipe-card__title">{title}</h2>

                <p className="recipe-card__meta">
                    {duration} Min • {difficulty}
                </p>

                <p className="recipe-card__rating">
                    {'⭐'.repeat(rating)}
                </p>
            </div>
        </article>
    );

    if (!to) {
        return card;
    }

    return (
        <Link className="recipe-card-link" to={to}>
            {card}
        </Link>
    );
}
