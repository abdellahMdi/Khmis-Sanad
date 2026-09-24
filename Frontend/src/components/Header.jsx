import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { selectAuth } from '../store/authSlice';
import { useLogoutMutation } from '../api/api';
import Button from './Button';

const publicLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/produits', label: 'Catalogue' },
];

export default function Header() {
    const { user, role } = useSelector(selectAuth);
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const handleLogout = async () => {
        await logout();
        setOpen(false);
        navigate('/');
    };

    const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

    return (
        <header className="sticky top-0 z-30 border-b border-brand-accent/15 bg-white shadow-sm">
            <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-2.5">
                <NavLink
                    to="/"
                    className="min-w-0 shrink"
                    aria-label="Coopérative Sanad"
                    onClick={() => setOpen(false)}
                >
                    <img
                        src="/myassets/headerimg.png"
                        alt="Coopérative Sanad"
                        className="h-10 w-auto max-w-[160px] object-contain object-left sm:h-14 sm:max-w-[220px] md:h-16 md:max-w-[280px]"
                    />
                </NavLink>
                <button
                    type="button"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-brand-accent/25 px-3 text-sm font-semibold text-brand-text md:hidden"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls="site-nav"
                >
                    {open ? 'Fermer' : 'Menu'}
                </button>
                {open ? (
                    <button
                        type="button"
                        className="fixed inset-0 top-[57px] z-10 bg-brand-text/40 md:hidden"
                        aria-label="Fermer le menu"
                        onClick={() => setOpen(false)}
                    />
                ) : null}
                <nav
                    id="site-nav"
                    className={`${
                        open ? 'flex' : 'hidden'
                    } absolute left-0 right-0 top-full z-20 max-h-[min(80vh,32rem)] flex-col gap-1 overflow-y-auto border-b border-brand-accent/15 bg-white px-3 py-3 shadow-md md:static md:z-auto md:flex md:max-h-none md:flex-row md:flex-wrap md:items-center md:gap-1 md:overflow-visible md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
                >
                    {publicLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={linkClass}
                            onClick={() => setOpen(false)}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    {role === 'client' ? (
                        <>
                            <NavLink to="/panier" className={linkClass} onClick={() => setOpen(false)}>
                                Panier
                            </NavLink>
                            <NavLink to="/commandes" className={linkClass} onClick={() => setOpen(false)}>
                                Commandes
                            </NavLink>
                        </>
                    ) : null}
                    {role === 'artisan' ? (
                        <NavLink
                            to="/artisan/boutique"
                            className={linkClass}
                            onClick={() => setOpen(false)}
                        >
                            Ma boutique
                        </NavLink>
                    ) : null}
                    {role === 'admin' ? (
                        <NavLink
                            to="/admin/cooperatives"
                            className={linkClass}
                            onClick={() => setOpen(false)}
                        >
                            Admin
                        </NavLink>
                    ) : null}
                    {user ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex min-h-11 w-full items-center rounded-lg px-3 py-2 text-left text-sm font-semibold text-brand-text/75 hover:bg-brand-bg hover:text-brand-accent md:min-h-0 md:w-auto md:px-2 md:py-1.5"
                        >
                            Déconnexion
                        </button>
                    ) : (
                        <>
                            <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
                                Connexion
                            </NavLink>
                            <Button
                                variant="accent"
                                className="mt-1 w-full md:mt-0 md:w-auto"
                                onClick={() => {
                                    setOpen(false);
                                    navigate('/register');
                                }}
                            >
                                Inscription
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
