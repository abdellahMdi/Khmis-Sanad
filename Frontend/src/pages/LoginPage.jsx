import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../api/api';
import { apiErrorMessage } from '../utils/format';
import Button from '../components/Button';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [login] = useLoginMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Email et mot de passe requis.');
            return;
        }
        try {
            await login({ email, password }).unwrap();
            navigate(from, { replace: true });
        } catch (err) {
            setError(apiErrorMessage(err, 'Identifiants invalides.'));
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-2xl border border-brand-accent/15 bg-white p-5 shadow-sm sm:p-8">
            <img
                src="/myassets/biglogo.png"
                alt="Coopérative Sanad"
                className="mx-auto h-20 w-auto object-contain sm:h-28"
            />
            <h1 className="mt-4 text-center text-2xl font-extrabold text-brand-primary sm:text-3xl">Connexion</h1>
            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                <label className="block text-sm font-semibold text-brand-text">
                    Email
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field mt-1"
                        required
                    />
                </label>
                <label className="block text-sm font-semibold text-brand-text">
                    Mot de passe
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field mt-1"
                        required
                    />
                </label>
                {error ? (
                    <p role="alert" className="text-sm text-henne">
                        {error}
                    </p>
                ) : null}
                <Button type="submit" className="w-full">
                    Se connecter
                </Button>
            </form>
            <p className="mt-4 text-sm text-encre-muted">
                Pas encore de compte ?{' '}
                <Link to="/register" className="font-semibold text-brand-primary underline decoration-brand-gold underline-offset-4">
                    Inscription
                </Link>
            </p>
        </div>
    );
}
