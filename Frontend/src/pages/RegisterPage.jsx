import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../api/api';
import { apiErrorMessage } from '../utils/format';
import Button from '../components/Button';

export default function RegisterPage() {
    const [form, setForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
        telephone: '',
        role: 'client',
        shop_name: '',
        terroir: '',
        bio: '',
    });
    const [error, setError] = useState('');
    const [register] = useRegisterMutation();
    const navigate = useNavigate();

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
            setError('Le mot de passe doit contenir une majuscule, une minuscule et un chiffre.');
            return;
        }
        if (form.password !== form.password_confirmation) {
            setError('La confirmation du mot de passe ne correspond pas.');
            return;
        }
        if (form.role === 'artisan' && !form.shop_name) {
            setError('Le nom de boutique est requis pour un artisan.');
            return;
        }
        try {
            await register(form).unwrap();
            navigate(form.role === 'artisan' ? '/artisan/boutique' : '/');
        } catch (err) {
            setError(apiErrorMessage(err, 'Inscription impossible.'));
        }
    };

    return (
        <div className="mx-auto max-w-lg rounded-2xl border border-brand-accent/15 bg-white p-5 shadow-sm sm:p-8">
            <img
                src="/myassets/biglogo.png"
                alt="Coopérative Sanad"
                className="mx-auto h-20 w-auto object-contain sm:h-28"
            />
            <p className="mt-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
                Rejoindre le souk
            </p>
            <h1 className="mt-1 text-center text-2xl font-extrabold text-brand-primary sm:text-3xl">Créer un compte</h1>
            <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                    Prénom
                    <input
                        required
                        value={form.firstname}
                        onChange={set('firstname')}
                        className="input-field mt-1"
                    />
                </label>
                <label className="text-sm">
                    Nom
                    <input
                        required
                        value={form.lastname}
                        onChange={set('lastname')}
                        className="input-field mt-1"
                    />
                </label>
                <label className="text-sm sm:col-span-2">
                    Email
                    <input
                        type="email"
                        required
                        value={form.email}
                        onChange={set('email')}
                        className="input-field mt-1"
                    />
                </label>
                <label className="text-sm">
                    Mot de passe
                    <input
                        type="password"
                        required
                        value={form.password}
                        onChange={set('password')}
                        className="input-field mt-1"
                    />
                </label>
                <label className="text-sm">
                    Confirmation
                    <input
                        type="password"
                        required
                        value={form.password_confirmation}
                        onChange={set('password_confirmation')}
                        className="input-field mt-1"
                    />
                </label>
                <label className="text-sm sm:col-span-2">
                    Téléphone (WhatsApp)
                    <input
                        value={form.telephone}
                        onChange={set('telephone')}
                        className="input-field mt-1"
                    />
                </label>
                <fieldset className="sm:col-span-2 text-sm">
                    <legend className="mb-2">Je m’inscris en tant que</legend>
                    <label className="mr-4">
                        <input
                            type="radio"
                            name="role"
                            value="client"
                            checked={form.role === 'client'}
                            onChange={set('role')}
                        />{' '}
                        Client
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="artisan"
                            checked={form.role === 'artisan'}
                            onChange={set('role')}
                        />{' '}
                        Artisan / coopérative
                    </label>
                    {form.role === 'artisan' ? (
                        <p className="mt-2 text-encre-muted">
                            Après inscription, déposez un justificatif dans Ma boutique.
                            L’admin l’examine avant d’accepter ou de bloquer le compte.
                        </p>
                    ) : null}
                </fieldset>
                {form.role === 'artisan' ? (
                    <>
                        <label className="text-sm sm:col-span-2">
                            Nom de la boutique
                            <input
                                required
                                value={form.shop_name}
                                onChange={set('shop_name')}
                                className="input-field mt-1"
                            />
                        </label>
                        <label className="text-sm sm:col-span-2">
                            Terroir
                            <input
                                value={form.terroir}
                                onChange={set('terroir')}
                                className="input-field mt-1"
                            />
                        </label>
                        <label className="text-sm sm:col-span-2">
                            Bio
                            <textarea
                                value={form.bio}
                                onChange={set('bio')}
                                className="input-field mt-1"
                            />
                        </label>
                    </>
                ) : null}
                {error ? (
                    <p role="alert" className="sm:col-span-2 text-sm text-henne">
                        {error}
                    </p>
                ) : null}
                <Button
                    type="submit"
                    className="sm:col-span-2 w-full"
                >
                    S’inscrire
                </Button>
            </form>
            <p className="mt-4 text-sm text-encre-muted">
                Déjà inscrit ?{' '}
                <Link to="/login" className="font-semibold text-brand-primary underline decoration-brand-gold underline-offset-4">
                    Connexion
                </Link>
            </p>
        </div>
    );
}
