import React from 'react';
import { cooperativesData } from '../data/mockData';

export default function CooperativesSection() {
  return (
    <section className="my-9">
      <span className="block text-[11px] font-bold tracking-widest uppercase text-[#8B3A2B] mb-1">
        Nos Partenaires
      </span>
      <h2 className="font-serif text-2xl font-bold text-[#1C3A27] mb-4">
        Coopératives & Artisans Certifiés
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cooperativesData.map((coop) => (
          <div
            key={coop.id}
            className="bg-white border border-[#E5DFD5] rounded-2xl p-5 text-center hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full border-2 border-[#D97706] flex items-center justify-center text-2xl mx-auto mb-2 bg-[#FAF7F2]">
              {coop.avatar}
            </div>
            <div className="text-sm font-extrabold text-[#1C3A27]">{coop.name}</div>
            <div className="text-xs text-gray-500 mb-3">📍 {coop.location}</div>

            <div className="flex justify-center gap-4 mb-3">
              <div>
                <span className="text-lg font-black text-[#8B3A2B] block leading-none">{coop.products}</span>
                <span className="text-[10px] text-gray-400">Produits</span>
              </div>
              <div>
                <span className="text-lg font-black text-[#8B3A2B] block leading-none">{coop.years}</span>
                <span className="text-[10px] text-gray-400">Ans</span>
              </div>
              <div>
                <span className="text-lg font-black text-[#8B3A2B] block leading-none">{coop.rating}</span>
                <span className="text-[10px] text-gray-400">Note</span>
              </div>
            </div>

            <button className="text-xs font-bold text-[#1C3A27] border border-[#1C3A27] px-3.5 py-1.5 rounded-full hover:bg-[#1C3A27] hover:text-white transition-colors">
              Voir la boutique &rarr;
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}