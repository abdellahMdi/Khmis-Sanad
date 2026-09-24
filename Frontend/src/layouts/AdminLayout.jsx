import { NavLink, Outlet } from 'react-router-dom';

const links = [
    { to: '/admin/cooperatives', label: 'Coopératives' },
    { to: '/admin/avis', label: 'Avis' },
    { to: '/admin/utilisateurs', label: 'Utilisateurs' },
];

export default function AdminLayout() {
    return (
        <div className="grid min-w-0 gap-5 lg:grid-cols-[220px_1fr] lg:gap-8">
            <aside className="h-fit rounded-2xl border border-brand-gold/30 bg-brand-primary p-4 text-white shadow-sm sm:p-5">
                <p className="text-lg font-bold">Modération</p>
                <p className="mt-1 text-xs text-white/60">Administration Khmis Sanad</p>
                <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:mt-5 lg:flex-col lg:overflow-visible">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `shrink-0 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                    isActive
                                        ? 'bg-brand-accent text-white'
                                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <div className="min-w-0">
                <Outlet />
            </div>
        </div>
    );
}
