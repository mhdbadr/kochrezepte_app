import './RecipeCard.css';

interface RecipeCardProps {
    title: string;
    imageUrl: string;
    duration: number;
    difficulty: string;
    category: string;
    rating?: number;
    compact?: boolean;
}

export default function RecipeCard({
                                       title,
                                       imageUrl,
                                       duration,
                                       difficulty,
                                       category,
                                       rating = 0,
                                       compact = false
                                   }: RecipeCardProps) {
    return (
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
}