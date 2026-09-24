export default function RatingStars({ value = 0, max = 5, onChange }) {
    const rating = Number(value) || 0;
    const interactive = typeof onChange === 'function';

    return (
        <div
            className="flex items-center gap-0.5"
            role={interactive ? 'radiogroup' : undefined}
            aria-label={`${rating} sur ${max}`}
        >
            {Array.from({ length: max }).map((_, index) => {
                const starValue = index + 1;
                const filled = starValue <= Math.round(rating);
                const className = filled ? 'text-brand-gold' : 'text-brand-gold/30';

                if (interactive) {
                    return (
                        <button
                            key={starValue}
                            type="button"
                            role="radio"
                            aria-checked={starValue === rating}
                            aria-label={`${starValue} étoile${starValue > 1 ? 's' : ''}`}
                            className={`text-2xl leading-none transition hover:scale-110 ${className}`}
                            onClick={() => onChange(starValue)}
                        >
                            ★
                        </button>
                    );
                }

                return (
                    <span key={starValue} className={`text-lg ${className}`} aria-hidden>
                        ★
                    </span>
                );
            })}
        </div>
    );
}
