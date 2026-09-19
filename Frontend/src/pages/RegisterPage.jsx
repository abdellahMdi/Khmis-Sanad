import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  ShoppingBag,
  Store,
  ArrowRight
} from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    role: 'client', // 'client' or 'artisan'
    firstname: '',
    lastname: '',
    email: '',
    telephone: '',
    mot_de_passe: '',
    mot_de_passe_confirmation: '',
    agree_terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.mot_de_passe !== formData.mot_de_passe_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!formData.agree_terms) {
      setError('Veuillez accepter les conditions générales.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          role: formData.role,
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          telephone: formData.telephone,
          mot_de_passe: formData.mot_de_passe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de l\'inscription.');
      }

      setSuccess(true);
      localStorage.setItem('auth_token', data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C3E35] flex flex-col font-sans">
      
      {/* Top Banner */}
      <header className="bg-[#1A4331] text-white py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs md:text-sm">
          <span>🌿 Produits Bio & Terroir Marocain 100% Naturels</span>
          <div className="flex gap-4">
            <a href="tel:+212528000000" className="hover:text-[#C5A059] transition">📞 Service Client: +212 528 000 000</a>
            <a href="/login" className="hover:text-[#C5A059] transition hidden sm:inline">Déjà client ? Se connecter</a>
          </div>
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-white border-b border-[#E8E2D9] py-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1A4331] text-[#C5A059] rounded-full flex items-center justify-center text-xl font-bold border-2 border-[#C5A059]">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold tracking-wider text-[#1A4331]">COOPÉRATIVE SANAD</span>
              <span className="text-[10px] tracking-widest uppercase text-[#8C7A6B]">Khmissa Sanad • Terroir & Bio</span>
            </div>
          </a>

          <a 
            href="/login" 
            className="text-sm font-semibold text-[#1A4331] hover:text-[#C5A059] border border-[#1A4331] px-4 py-2 rounded-lg transition"
          >
            Se connecter
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Section */}
        <section className="lg:col-span-7 bg-white p-6 md:p-10 rounded-2xl border border-[#E8E2D9] shadow-sm">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">Création de compte</span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1A4331] mt-1">Rejoignez la plateforme</h1>
            <p className="text-sm text-gray-600 mt-1">
              Choisissez votre type de compte pour commencer.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-8 text-center bg-[#F4F8F5] rounded-xl border border-[#D0E2D5]">
              <CheckCircle className="w-16 h-16 text-[#1A4331] mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold text-[#1A4331]">Inscription réussie !</h2>
              <p className="text-sm text-gray-600 mt-2">
                {formData.role === 'artisan'
                  ? 'Votre compte gérant de coopérative a été créé. Vous pouvez maintenant configurer votre boutique.'
                  : 'Votre compte acheteur a été créé avec succès et votre panier a été initialisé.'}
              </p>
              <a
                href={formData.role === 'artisan' ? '/admin/dashboard' : '/dashboard'}
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#1A4331] text-white font-medium rounded-lg hover:bg-[#2C5E43] transition"
              >
                Accéder à mon espace <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Role Selection Cards */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  Je suis : <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('client')}
                    className={`p-4 rounded-xl border-2 text-left transition flex flex-col gap-2 cursor-pointer ${
                      formData.role === 'client'
                        ? 'border-[#1A4331] bg-[#F4F8F5]'
                        : 'border-[#E8E2D9] hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <ShoppingBag className={`w-5 h-5 ${formData.role === 'client' ? 'text-[#1A4331]' : 'text-gray-400'}`} />
                      <input
                        type="radio"
                        name="role"
                        value="client"
                        checked={formData.role === 'client'}
                        onChange={() => {}}
                        className="text-[#1A4331] focus:ring-[#C5A059]"
                      />
                    </div>
                    <div>
                      <span className="block font-bold text-sm text-[#1A4331]">Acheteur</span>
                      <span className="text-xs text-gray-500">Pour commander des produits du terroir</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('artisan')}
                    className={`p-4 rounded-xl border-2 text-left transition flex flex-col gap-2 cursor-pointer ${
                      formData.role === 'artisan'
                        ? 'border-[#1A4331] bg-[#F4F8F5]'
                        : 'border-[#E8E2D9] hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Store className={`w-5 h-5 ${formData.role === 'artisan' ? 'text-[#1A4331]' : 'text-gray-400'}`} />
                      <input
                        type="radio"
                        name="role"
                        value="artisan"
                        checked={formData.role === 'artisan'}
                        onChange={() => {}}
                        className="text-[#1A4331] focus:ring-[#C5A059]"
                      />
                    </div>
                    <div>
                      <span className="block font-bold text-sm text-[#1A4331]">Gérant Coopérative</span>
                      <span className="text-xs text-gray-500">Pour vendre vos produits d'artisanat</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Firstname & Lastname */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="firstname"
                      required
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="Anass"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#DCD5CB] focus:ring-2 focus:ring-[#C5A059] outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="lastname"
                      required
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder="El Amrani"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#DCD5CB] focus:ring-2 focus:ring-[#C5A059] outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Adresse Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@domaine.ma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#DCD5CB] focus:ring-2 focus:ring-[#C5A059] outline-none text-sm"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+212 6 00 00 00 00"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#DCD5CB] focus:ring-2 focus:ring-[#C5A059] outline-none text-sm"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="mot_de_passe"
                      required
                      value={formData.mot_de_passe}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#DCD5CB] focus:ring-2 focus:ring-[#C5A059] outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Confirmer le mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="mot_de_passe_confirmation"
                      required
                      value={formData.mot_de_passe_confirmation}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#DCD5CB] focus:ring-2 focus:ring-[#C5A059] outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="agree_terms"
                  name="agree_terms"
                  checked={formData.agree_terms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-[#1A4331] focus:ring-[#C5A059] border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="agree_terms" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                  J'accepte les <a href="/terms" className="text-[#1A4331] font-semibold underline">Conditions Générales de Vente</a> et la politique de confidentialité de la Coopérative Sanad.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-[#1A4331] hover:bg-[#2A5943] text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                ) : (
                  <>
                    <span>Créer un compte {formData.role === 'artisan' ? 'Artisan' : 'Acheteur'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#E8E2D9] text-center text-xs text-gray-500">
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="text-[#1A4331] font-bold underline hover:text-[#C5A059]">
              Connectez-vous ici
            </a>
          </div>
        </section>

        {/* Dynamic Benefits Banner */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-[#1A4331] text-white p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#C5A059] opacity-20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-[#C5A059] text-[#1A4331] text-[11px] font-bold uppercase rounded-full tracking-wider mb-4">
                {formData.role === 'artisan' ? 'Espace Vendeur / Coopérative' : 'Espace Acheteur'}
              </span>

              <h2 className="text-2xl font-serif font-bold text-[#FAF8F5] mb-6">
                {formData.role === 'artisan' 
                  ? 'Digitalisez votre coopérative et vendez directement' 
                  : 'Le meilleur du terroir artisanal marocain'}
              </h2>

              <ul className="space-y-5 text-sm text-gray-200">
                {formData.role === 'artisan' ? (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="p-2 bg-white/10 rounded-lg text-[#C5A059] shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Vitrine Personnalisée</h4>
                        <p className="text-xs text-gray-300 mt-0.5">Personnalisez votre boutique (nom, biographie, terroir d'origine)[cite: 1].</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-2 bg-white/10 rounded-lg text-[#C5A059] shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Gestion de Catalogue Intuitive</h4>
                        <p className="text-xs text-gray-300 mt-0.5">Gérez facilement vos articles, prix, remises et stocks[cite: 1].</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-2 bg-white/10 rounded-lg text-[#C5A059] shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Commandes Directes & WhatsApp</h4>
                        <p className="text-xs text-gray-300 mt-0.5">Recevez des notifications immédiates et échangez directement avec vos acheteurs[cite: 1].</p>
                      </div>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="p-2 bg-white/10 rounded-lg text-[#C5A059] shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Produits 100% Bio & Terroir</h4>
                        <p className="text-xs text-gray-300 mt-0.5">Accédez aux produits authentiques en direct des coopératives[cite: 1].</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-2 bg-white/10 rounded-lg text-[#C5A059] shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Livraison & Contact Direct</h4>
                        <p className="text-xs text-gray-300 mt-0.5">Échangez directement sur WhatsApp avec le producteur[cite: 1].</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-2 bg-white/10 rounded-lg text-[#C5A059] shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Qualité & Traçabilité</h4>
                        <p className="text-xs text-gray-300 mt-0.5">Authenticité et traçabilité des produits garanties[cite: 1].</p>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}