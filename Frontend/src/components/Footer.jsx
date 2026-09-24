import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';
import { useGetCategoriesQuery } from '../api/api';

const linkClass = 'block text-white/70 transition hover:text-white';

export default function Footer() {
    const { user, role } = useSelector(selectAuth);
    const { data: categories } = useGetCategoriesQuery();

    return (
        <footer className="mt-8 bg-black text-white">
            <div className="mx-auto grid max-w-6xl items-start gap-6 px-3 py-5 sm:grid-cols-2 sm:px-4 lg:grid-cols-[1.8fr_0.9fr_0.9fr_1.1fr] lg:items-center">
                <div className="sm:col-span-2 lg:col-span-1">
                    <img
                        src="/myassets/botomimag.png"
                        alt="Coopérative Sanad"
                        className="h-32 w-auto max-w-full object-contain object-left invert sm:h-40 md:h-56"
                    />
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                        Boutique
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                        <li>
                            <Link to="/" className={linkClass}>
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <Link to="/produits" className={linkClass}>
                                Catalogue
                            </Link>
                        </li>
                        {(categories || []).slice(0, 4).map((cat) => (
                            <li key={cat.id}>
                                <Link
                                    to={`/produits?categorie=${encodeURIComponent(cat.name)}`}
                                    className={linkClass}
                                >
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                        Espace
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                        {role === 'client' ? (
                            <>
                                <li>
                                    <Link to="/panier" className={linkClass}>
                                        Panier
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/commandes" className={linkClass}>
                                        Mes commandes
                                    </Link>
                                </li>
                            </>
                        ) : null}
                        {role === 'artisan' ? (
                            <>
                                <li>
                                    <Link to="/artisan/boutique" className={linkClass}>
                                        Ma boutique
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/artisan/produits" className={linkClass}>
                                        Mes produits
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/artisan/commandes" className={linkClass}>
                                        Commandes reçues
                                    </Link>
                                </li>
                            </>
                        ) : null}
                        {role === 'admin' ? (
                            <>
                                <li>
                                    <Link to="/admin/cooperatives" className={linkClass}>
                                        Coopératives
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/avis" className={linkClass}>
                                        Avis à modérer
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/utilisateurs" className={linkClass}>
                                        Utilisateurs
                                    </Link>
                                </li>
                            </>
                        ) : null}
                        {!user ? (
                            <>
                                <li>
                                    <Link to="/login" className={linkClass}>
                                        Connexion
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className={linkClass}>
                                        Inscription client
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className={linkClass}>
                                        Devenir artisan
                                    </Link>
                                </li>
                            </>
                        ) : null}
                    </ul>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                        Comment ça marche
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-white/70">
                        <li>Commandez depuis le catalogue</li>
                        <li>Paiement hors plateforme</li>
                        <li>Échange direct sur WhatsApp</li>
                        <li>Avis après achat, validés par l’équipe</li>
                        <li>Coopératives acceptées sur justificatif</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-1 px-3 py-2 text-center text-[11px] text-white/50 sm:flex-row sm:px-4 sm:text-left">
                    <p>© {new Date().getFullYear()} Coopérative Sanad · Maroc</p>
                    <p>Marketplace du terroir · WhatsApp · Pas de paiement en ligne</p>
                </div>
            </div>
        </footer>
    );
}
