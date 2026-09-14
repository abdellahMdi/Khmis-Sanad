import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5DFD5] pt-11 mt-10 text-xs text-gray-600">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-9">
          <div>
            <div className="text-sm font-black text-[#1C3A27] mb-2 flex items-center gap-2">
              ✋ Khmissa Sanad
            </div>
            <p className="leading-relaxed mb-3">
              Marketplace dédiée à la valorisation des artisans et coopératives marocaines. Chaque achat soutient directement une famille d’artisans.
            </p>
          </div>
          <div>
            <div className="font-bold uppercase tracking-wider text-[#1C3A27] mb-3">Catalogue</div>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-[#D97706]">Huiles & Soins</a>
              <a href="#" className="hover:text-[#D97706]">Épices & Safran</a>
              <a href="#" className="hover:text-[#D97706]">Miels & Amlou</a>
              <a href="#" className="hover:text-[#D97706]">Tapis Berbères</a>
            </div>
          </div>
          <div>
            <div className="font-bold uppercase tracking-wider text-[#1C3A27] mb-3">Khmissa Sanad</div>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-[#D97706]">Notre Mission</a>
              <a href="#" className="hover:text-[#D97706]">Les Coopératives</a>
              <a href="#" className="hover:text-[#D97706]">Impact Social</a>
            </div>
          </div>
          <div>
            <div className="font-bold uppercase tracking-wider text-[#1C3A27] mb-3">Aide & Contact</div>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-[#D97706]">FAQ</a>
              <a href="#" className="hover:text-[#D97706]">Livraison & Retours</a>
              <a href="https://wa.me/" className="text-[#25D366] font-semibold">WhatsApp Support</a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5DFD5] py-4 flex flex-col sm:flex-row items-center justify-between text-gray-400 gap-2">
          <span>&copy; 2026 Khmissa Sanad — Artisanat & Terroir Marocain. Tous droits réservés.</span>
          <span className="text-[#8B3A2B] font-bold">🇲🇦 Made in Morocco</span>
        </div>
      </div>
    </footer>
  );
}