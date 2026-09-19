import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default function HomePage({ cartCount = 0, onAddToCart, onWhatsappOrder }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cooperatives, setCooperatives] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDatabaseData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes, coopRes] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/cooperatives`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }

        if (coopRes.ok) {
          const coopData = await coopRes.json();
          setCooperatives(coopData);
        }
      } catch (error) {
        console.error('Error fetching database records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabaseData();
  }, []);

  // Filter products using exact database columns (cat_id, name, cooperative relations)
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.cat_id === Number(selectedCategory);

    const query = searchQuery.toLowerCase();
    const nameMatch = (product.name || '').toLowerCase().includes(query);
    const coopNameMatch = (product.cooperative?.name || '').toLowerCase().includes(query);

    return matchesCategory && (nameMatch || coopNameMatch);
  });

  // Calculate average rating from 'avis' table relationship
  const getAverageRating = (avisArray) => {
    if (!avisArray || avisArray.length === 0) return '4.9';
    const total = avisArray.reduce((acc, curr) => acc + (curr.note || 0), 0);
    return (total / avisArray.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C3E35] font-sans">
      {/* Announcement Bar */}
      <div className="bg-[#1A4331] text-white py-2 px-4 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-2">
            <span className="text-[#C5A059]">✨</span>
            Direct Producteur • Traçabilité & Authenticité 100% Garantie
          </span>
          <div className="hidden sm:flex gap-6 text-gray-200">
            <a href="/register?role=artisan" className="hover:text-[#C5A059] font-semibold transition">
              🏛️ Vous êtes une Coopérative ? Vendez vos produits
            </a>
            <a href="tel:+212528000000" className="hover:text-[#C5A059]">📞 +212 528 000 000</a>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <nav className="bg-white border-b border-[#E8E2D9] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-[#1A4331] text-[#C5A059] rounded-full flex items-center justify-center text-xl font-serif font-bold border-2 border-[#C5A059]">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-serif font-bold tracking-wider text-[#1A4331]">
                SANAD TERROIR
              </span>
              <span className="text-[9px] tracking-widest uppercase text-[#8C7A6B]">
                Marketplace Artisanale
              </span>
            </div>
          </a>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une huile, épice, miel ou coopérative..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAF8F5] border border-[#E8E2D9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/register?role=artisan"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[#1A4331] bg-[#FAF8F5] hover:bg-[#F4F8F5] px-3.5 py-2 rounded-lg border border-[#E8E2D9] transition"
            >
              <span>🏪</span> Espace Vendeur
            </a>

            <a href="/login" className="flex items-center gap-1.5 text-sm font-semibold text-[#1A4331] hover:text-[#C5A059] transition">
              <span>👤</span>
              <span className="hidden sm:inline">Connexion</span>
            </a>

            <a
              href="/panier"
              className="relative p-2.5 bg-[#F4F8F5] text-[#1A4331] rounded-full hover:bg-[#1A4331] hover:text-white transition"
            >
              <span>🛍️</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-[#1A4331] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1A4331]"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E8E2D9] p-4 space-y-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full px-4 py-2 text-sm bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg"
            />
            <a href="/register?role=artisan" className="block text-sm font-semibold text-[#1A4331] py-1">
              🏛️ Espace Vendeur / Coopérative
            </a>
            <a href="/login" className="block text-sm font-semibold text-[#1A4331] py-1">
              👤 Se connecter
            </a>
          </div>
        )}
      </nav>

      {/* Hero Banner */}
      <section className="relative bg-[#1A4331] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 rounded-full text-xs font-bold tracking-wider uppercase">
              🌿 100% Artisanal & Produits du Terroir
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight">
              Soutenez les coopératives locales en vous offrant le meilleur du terroir.
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-2xl">
              Achetez directement auprès des artisans. Pure argan, safran, miel et épices authentiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <a
                href="#catalog"
                className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#b08d4b] text-[#1A4331] font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Découvrir le catalogue</span> →
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 text-center space-y-1">
              <div className="text-2xl">🍯</div>
              <h3 className="font-serif font-bold text-white text-sm">Qualité Certifiée</h3>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 text-center space-y-1">
              <div className="text-2xl">💬</div>
              <h3 className="font-serif font-bold text-white text-sm">Direct WhatsApp</h3>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 text-center space-y-1">
              <div className="text-2xl">🚚</div>
              <h3 className="font-serif font-bold text-white text-sm">Livraison Rapide</h3>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 text-center space-y-1">
              <div className="text-2xl">🤝</div>
              <h3 className="font-serif font-bold text-white text-sm">Prix Équitable</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              Catalogue Marketplace
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A4331] mt-1">
              Produits du Terroir
            </h2>
          </div>
        </div>

        {/* Dynamic Category Buttons from 'categories' table */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#1A4331] text-white shadow'
                : 'bg-white text-gray-700 border border-[#E8E2D9] hover:bg-[#F4F8F5]'
            }`}
          >
            Tous les produits
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#1A4331] text-white shadow'
                  : 'bg-white text-gray-700 border border-[#E8E2D9] hover:bg-[#F4F8F5]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid from 'products' table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#1A4331] border-t-transparent"></div>
            <p className="text-xs text-gray-500 mt-3">Chargement des produits...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E2D9]">
            <p className="text-gray-500 text-sm">Aucun produit trouvé.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#1A4331] text-white text-xs font-semibold rounded-lg"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              // Extract values matching DB schema
              const coopName = product.cooperative?.name || 'Coopérative Sanad';
              const location = product.cooperative?.hq_location || 'Maroc';
              const originalPrice = Number(product.prix || 0);
              const discountPrice = product.prix_remise ? Number(product.prix_remise) : null;
              const displayPrice = discountPrice || originalPrice;
              
              // Extract image from 'product_img' relation table
              const primaryImg = product.product_img && product.product_img.length > 0
                ? product.product_img[0].url
                : 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=500';

              const rating = getAverageRating(product.avis);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
                >
                  <div className="relative h-48 bg-[#FAF8F5] overflow-hidden">
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#1A4331] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {location}
                    </span>
                    {discountPrice && (
                      <span className="absolute top-3 right-3 bg-[#C5A059] text-[#1A4331] text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        Promo
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span className="font-semibold text-[#C5A059]">{coopName}</span>
                        <span>⭐ {rating}</span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#1A4331] group-hover:text-[#C5A059] transition">
                        {product.name}
                      </h3>

                      <p className="text-xs text-gray-600 mt-2 line-clamp-2 italic">
                        {product.description || 'Produit artisanal fait main avec soin et authenticité.'}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E8E2D9]">
                      <div className="flex items-baseline justify-between mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[#1A4331]">{displayPrice} DH</span>
                          {discountPrice && (
                            <span className="text-xs text-gray-400 line-through">{originalPrice} DH</span>
                          )}
                        </div>
                        <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          product.stock > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                        }`}>
                          {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onAddToCart && onAddToCart(product.name)}
                          disabled={product.stock <= 0}
                          className="py-2.5 px-3 bg-[#FAF8F5] hover:bg-[#1A4331] hover:text-white border border-[#E8E2D9] text-[#1A4331] text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <span>🛍️</span>
                          <span>Panier</span>
                        </button>

                        <button
                          onClick={() => onWhatsappOrder && onWhatsappOrder(product.name, `${displayPrice} DH`, coopName)}
                          className="py-2.5 px-3 bg-[#25D366] hover:bg-[#1eb956] text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <span>💬</span>
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Cooperatives Spotlight Section matching 'cooperatives' table */}
      {cooperatives.length > 0 && (
        <section className="bg-white py-16 border-t border-[#E8E2D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-serif font-bold text-[#1A4331] mb-6">
              Nos Coopératives Partenaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {cooperatives.slice(0, 4).map((coop) => (
                <div
                  key={coop.id}
                  className="p-5 rounded-2xl border border-[#E8E2D9] hover:border-[#C5A059] transition bg-[#FAF8F5] flex flex-col items-center text-center space-y-2 group"
                >
                  <div className="w-14 h-14 bg-[#1A4331] text-[#C5A059] rounded-full flex items-center justify-center text-xl font-bold font-serif">
                    {coop.name ? coop.name.charAt(0) : 'C'}
                  </div>
                  <h4 className="font-serif font-bold text-[#1A4331] group-hover:text-[#C5A059]">
                    {coop.name}
                  </h4>
                  <p className="text-xs text-gray-500">{coop.hq_location || 'Maroc'}</p>
                  {coop.bio && (
                    <p className="text-[11px] text-gray-400 line-clamp-2 italic">{coop.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8E2D9] pt-12 pb-8 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1A4331] text-[#C5A059] rounded-full flex items-center justify-center font-serif font-bold text-sm">
                S
              </div>
              <span className="font-serif font-bold text-base text-[#1A4331]">SANAD TERROIR</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Marketplace marocaine dédiée à la valorisation des produits du terroir et du savoir-faire artisanal.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-[#1A4331] text-sm mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#catalog" className="hover:text-[#C5A059]">Tous les produits</a></li>
              <li><a href="/login" className="hover:text-[#C5A059]">Connexion</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-[#1A4331] text-sm mb-3">Espace Vendeurs</h4>
            <ul className="space-y-2">
              <li><a href="/register?role=artisan" className="hover:text-[#C5A059]">Devenir Vendeur</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-[#1A4331] text-sm mb-3">Contact & Support</h4>
            <p className="font-semibold text-[#1A4331]">📞 +212 528 000 000</p>
            <p className="font-semibold text-[#1A4331]">✉️ contact@sanadterroir.ma</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#E8E2D9] text-center text-gray-400">
          <p>© 2026 Sanad Terroir. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}