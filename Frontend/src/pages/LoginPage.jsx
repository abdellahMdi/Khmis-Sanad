// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Eye, EyeOff } from 'lucide-react';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { showLoading, updateToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const toastId = showLoading('Connexion en cours...');

        try {
            const response = await login({ email, password });
            updateToast(toastId, 'Connexion réussie ! Bienvenue !', 'success');

            const user = response.data?.user;
            const userRoles = user?.roles || [];

            if (userRoles.includes('admin') || user?.role === 'admin') {
                navigate('/admin');
            } else if (userRoles.includes('cooperative') || user?.role === 'cooperative') {
                if (user?.has_coop) {
                    navigate('/cooperative/dashboard');
                } else {
                    navigate('/cooperative/setup');
                }
            } else {
                navigate('/');
            }
        } catch (err) {
            let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';

            if (err.response?.status === 401) {
                errorMessage = 'Email ou mot de passe incorrect.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.errors) {
                const messages = Object.values(err.response.data.errors).flat();
                errorMessage = messages.join(' ');
            }

            setError(errorMessage);
            updateToast(toastId, errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#FAF5EF] font-montserrat flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl flex flex-col md:flex-row w-full max-w-4xl shadow-2xl overflow-hidden border border-[#E8DCCF]">
                {/* Form Section */}
                <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold text-center mb-6 text-[#A04000]">
                            Connexion
                        </h2>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-1 text-[#4A3B32]"
                                >
                                    Adresse Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3B0] focus:ring-2 focus:ring-[#C2591A] focus:border-[#C2591A] text-[#2C1810] placeholder-gray-400 transition-all duration-200 hover:border-[#C2591A] outline-none"
                                    placeholder="exemple@domaine.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium mb-1 text-[#4A3B32]"
                                >
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3B0] focus:ring-2 focus:ring-[#C2591A] focus:border-[#C2591A] text-[#2C1810] placeholder-gray-400 transition-all duration-200 hover:border-[#C2591A] outline-none"
                                        placeholder="Entrez votre mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#C2591A] transition-colors duration-200"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 text-xs text-red-700 bg-red-50 rounded-xl border border-red-200">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-md ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#C2591A] hover:bg-[#A04000] hover:shadow-lg active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2591A]'
                                }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Connexion en cours...
                                    </div>
                                ) : (
                                    'SE CONNECTER'
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Vous n'avez pas de compte ?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-[#C2591A] hover:text-[#A04000] hover:underline transition-colors duration-200"
                            >
                                S'inscrire
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Hero / Branding Section */}
                <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 bg-gradient-to-br from-[#A04000] via-[#C2591A] to-[#D97724] text-white">
                    <div className="text-center space-y-2">
                        <h1 className="font-extrabold text-white drop-shadow-md leading-none">
                            <span className="block text-6xl tracking-wide">Khmis</span>
                            <span className="block text-5xl tracking-tight text-[#FFE8D6]">Sanad</span>
                        </h1>
                        <p className="pt-2 text-lg font-medium text-[#FFF0E5] tracking-wide">
                            Marketplace Artisanale du Maroc
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;