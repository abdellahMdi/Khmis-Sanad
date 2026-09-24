import Button from './Button';

export default function ErrorState({ message, onRetry }) {
    return (
        <div
            role="alert"
            className="rounded-2xl border border-henne/25 bg-white p-6 text-center shadow-sm"
        >
            <p className="text-henne">{message || 'Impossible de charger ces données.'}</p>
            {onRetry ? (
                <Button className="mt-4" variant="secondary" onClick={onRetry}>
                    Réessayer
                </Button>
            ) : null}
        </div>
    );
}
