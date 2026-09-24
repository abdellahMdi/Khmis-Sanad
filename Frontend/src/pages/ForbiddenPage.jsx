export default function ForbiddenPage() {
    return (
        <div className="py-16 text-center">
            <p className="text-sm uppercase tracking-widest text-henne">403</p>
            <h1 className="mt-2 text-3xl">Accès refusé</h1>
            <p className="mt-3 text-encre-muted">
                Votre rôle ne permet pas d’ouvrir cette page.
            </p>
        </div>
    );
}
