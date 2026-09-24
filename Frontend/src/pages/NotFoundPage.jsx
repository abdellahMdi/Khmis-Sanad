import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFoundPage() {
    return (
        <div className="py-16 text-center">
            <p className="text-sm uppercase tracking-widest text-terracotta">404</p>
            <h1 className="mt-2 text-3xl">Page introuvable</h1>
            <p className="mt-3 text-encre-muted">
                Ce chemin n’existe pas dans le souk.
            </p>
            <Link to="/">
                <Button className="mt-6">Retour à l’accueil</Button>
            </Link>
        </div>
    );
}
