// components/Header.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Header({ onSearch }) {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHeaderData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // GET /api/auth/me
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);

        // GET /api/cart
        const cartRes = await api.get('/cart');
        const items = cartRes.data?.items || cartRes.data?.cart_items || [];
        const totalQty = items.reduce((sum, item) => sum + (item.quantite || item.quantity || 1), 0);
        setCartCount(totalQty);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeaderData();
  }, []);

  const handleLogout = async () => {
    try {
      // POST /api/auth/logout
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setCartCount(0);
      setIsDropdownOpen(false);
      window.location.href = '/login';
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isCooperative = user?.role?.label?.toLowerCase() === 'cooperative' || user?.role_id === 2;
  const isAdmin = user?.role?.label?.toLowerCase() === 'admin';

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DFD5] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#1C3A27] flex items-center justify-center text-[#D97706] font-bold text-lg shadow-md group-hover:bg-[#D97706] group-hover:text-white transition-colors duration-300">
            ✋
          </div>
          <div>
            <span className="font-serif text-lg md:text-xl font-bold text-[#1C3A27] block leading-none">
              Khmissa Sanad
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#8B3A2B] font-semibold">
              Artisanat Marocain
            </span>
          </div>
        </a>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit, une coopérative..."
              className="w-full bg-white border border-[#E5DFD5] text-xs rounded-full py-2 pl-9 pr-4 text-[#2C3531] focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>

        {/* User Navigation & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Cart Icon -> GET /api/cart */}
          <a
            href="/cart"
            className="relative p-2 text-[#1C3A27] hover:bg-white rounded-full transition-colors border border-transparent hover:border-[#E5DFD5]"
            title="Voir le panier"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#8B3A2B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>

          <div className="h-6 w-px bg-[#E5DFD5] hidden sm:block"></div>

          {isLoading ? (
            <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-full"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white border border-transparent hover:border-[#E5DFD5] transition-all focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#1C3A27] text-white flex items-center justify-center text-xs font-bold border-2 border-[#D97706]">
                  {user.firstname?.[0]}{user.lastname?.[0]}
                </div>

                <div className="text-left hidden md:block pr-1">
                  <div className="text-xs font-semibold text-[#1C3A27] leading-tight flex items-center gap-1">
                    {user.firstname} {user.lastname}
                    {user.role?.label && (
                      <span className="bg-[#1C3A27]/10 text-[#1C3A27] text-[9px] px-1.5 py-0.5 rounded font-medium">
                        {user.role.label}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {user.cooperative?.name || user.email}
                  </div>
                </div>

                <svg className="w-3.5 h-3.5 text-gray-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Navigation mapped to Laravel Route Middleware */}
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E5DFD5] py-2 z-50"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#E5DFD5]">
                    <p className="text-xs font-bold text-[#1C3A27]">{user.firstname} {user.lastname}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                  </div>

                  {/* Route: GET /api/cooperative/dashboard */}
                  {isCooperative && (
                    <>
                      <a
                        href="/cooperative/dashboard"
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF7F2] hover:text-[#D97706] transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        Espace Coopérative
                      </a>
                      <a
                        href="/cooperative/products"
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF7F2] hover:text-[#D97706] transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                        Mes Produits
                      </a>
                    </>
                  )}

                  {/* Route: GET /api/admin/dashboard */}
                  {isAdmin && (
                    <a
                      href="/admin/dashboard"
                      className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF7F2] hover:text-[#D97706] transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      Administration
                    </a>
                  )}

                  {/* Route: GET /api/my/orders */}
                  <a
                    href="/my/orders"
                    className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF7F2] hover:text-[#D97706] transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    Mes Commandes
                  </a>

                  {/* Route: GET /api/profile */}
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF7F2] hover:text-[#D97706] transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    Mon Profil
                  </a>

                  <div className="border-t border-[#E5DFD5] my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-xs text-[#8B3A2B] hover:bg-[#FAF7F2] transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-[#1C3A27] hover:text-[#D97706] transition-colors"
              >
                Se connecter
              </a>
              <a
                href="/register"
                className="px-4 py-1.5 text-xs font-semibold bg-[#1C3A27] hover:bg-[#142A1C] text-white rounded-full transition-all shadow-sm"
              >
                S'inscrire
              </a>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}