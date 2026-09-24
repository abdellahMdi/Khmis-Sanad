import Button from './Button';

export default function Pagination({ meta, onPageChange }) {
    if (!meta || meta.last_page <= 1) {
        return null;
    }

    return (
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
            <Button
                variant="ghost"
                disabled={meta.current_page <= 1}
                onClick={() => onPageChange(meta.current_page - 1)}
            >
                Précédent
            </Button>
            <span className="text-sm text-encre-muted">
                {meta.current_page} / {meta.last_page}
            </span>
            <Button
                variant="ghost"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => onPageChange(meta.current_page + 1)}
            >
                Suivant
            </Button>
        </nav>
    );
}
