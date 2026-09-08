// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Eye, EyeOff, User, Store } from 'lucide-react';

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('client'); // 'client' or 'cooperative'
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { showError, showLoading, updateToast } = useToast();

    const validate = () => {
        const newErrors = {};

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = 'Format d\'email invalide.';
        }

        const passwordRules = [
            { test: (p) => p.length >= 8, message: 'au moins 8 caractères' },
            { test: (p) => /[a-z]/.test(p), message: 'une lettre minuscule' },
            { test: (p) => /[A-Z]/.test(p), message: 'une lettre majuscule' },
            { test: (p) => /\d/.test(p), message: 'un chiffre' },
            { test: (p) => /[^a-zA-Z0-9]/.test(p), message: 'un symbole' },
        ];

        const failedRules = passwordRules
            .filter((rule) => !rule.test(password))
            .map((rule) => rule.message);

        if (failedRules.length > 0) {
            newErrors.password = `Le mot de passe doit contenir: ${failedRules.join(', ')}.`;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas !';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showError(Object.values(validationErrors)[0]);
            return;
        }

        setErrors({});
        setIsLoading(true);
        const toastId = showLoading('Création de votre compte utilisateur...');

        try {
            await register({
                name,
                email,
                role,
                password,
                password_confirmation: confirmPassword,
            });

            updateToast(toastId, 'Compte créé avec succès !', 'success');

            if (role === 'cooperative') {
                navigate('/cooperative/setup');
            } else {
                navigate('/');
            }
        } catch (err) {
            let generalError = 'Échec de l\'inscription. Veuillez réessayer.';
            const newErrors = {};
            const resp = err.response?.data;

            if (resp?.errors) {
                if (resp.errors.email) newErrors.email = resp.errors.email[0];
                if (resp.errors.password) newErrors.password = resp.errors.password[0];
            } else if (resp?.message) {
                generalError = resp.message;
            }

            setErrors(newErrors);
            updateToast(toastId, generalError, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#FAF5EF] font-montserrat flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl flex flex-col md:flex-row w-full max-w-4xl shadow-2xl overflow-hidden border border-[#E8DCCF]">
                <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold text-center mb-6 text-[#A04000]">
                            Créer un compte
                        </h2>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Role Selector */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#4A3B32]">
                                    Je souhaite rejoindre en tant que
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRole('client')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                                            role === 'client'
                                                ? 'border-[#C2591A] bg-[#FFF0E5] text-[#C2591A] shadow-sm'
                                                : 'border-[#D8C3B0] bg-white text-gray-500 hover:border-[#C2591A]/50'
                                        }`}
                                    >
                                        <User size={22} className="mb-1" />
                                        <span className="text-xs font-semibold">Acheteur / Client</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRole('cooperative')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                                            role === 'cooperative'
                                                ? 'border-[#C2591A] bg-[#FFF0E5] text-[#C2591A] shadow-sm'
                                                : 'border-[#D8C3B0] bg-white text-gray-500 hover:border-[#C2591A]/50'
                                        }`}
                                    >
                                        <Store size={22} className="mb-1" />
                                        <span className="text-xs font-semibold">Responsable Coopérative</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1 text-[#4A3B32]">
                                    Nom Complet
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8C3B0] focus:ring-2 focus:ring-[#C2591A] focus:border-[#C2591A] text-[#2C1810] placeholder-gray-400 outline-none transition-all duration-200 hover:border-[#C2591A]"
                                    placeholder="Entrez votre nom et prénom"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1 text-[#4A3B32]">
                                    Adresse Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className={`w-full px-4 py-2.5 rounded-xl border ${
                                        errors.email ? 'border-red-500' : 'border-[#D8C3B0]'
                                    } focus:ring-2 focus:ring-[#C2591A] focus:border-[#C2591A] text-[#2C1810] outline-none transition-all duration-200 hover:border-[#C2591A]`}
                                    placeholder="exemple@domaine.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-1 text-[#4A3B32]">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className={`w-full px-4 py-2.5 rounded-xl border ${
                                            errors.password ? 'border-red-500' : 'border-[#D8C3B0]'
                                        } focus:ring-2 focus:ring-[#C2591A] focus:border-[#C2591A] text-[#2C1810] outline-none transition-all duration-200 hover:border-[#C2591A]`}
                                        placeholder="Créez un mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#C2591A]"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium mb-1 text-[#4A3B32]">
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        className={`w-full px-4 py-2.5 rounded-xl border ${
                                            errors.confirmPassword ? 'border-red-500' : 'border-[#D8C3B0]'
                                        } focus:ring-2 focus:ring-[#C2591A] focus:border-[#C2591A] text-[#2C1810] outline-none transition-all duration-200 hover:border-[#C2591A]`}
                                        placeholder="Confirmez votre mot de passe"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#C2591A]"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>

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
                                        Création du compte...
                                    </div>
                                ) : (
                                    'CRÉER MON COMPTE'
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Vous avez déjà un compte ?{' '}
                            <Link to="/login" className="font-semibold text-[#C2591A] hover:text-[#A04000] hover:underline transition-colors duration-200">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>

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

export default RegisterPage;