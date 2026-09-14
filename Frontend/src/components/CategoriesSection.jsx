import React from 'react';
import { categoriesData } from '../data/mockData';

export default function CategoriesSection({ onCategoryClick }) {
  return (
    <section id="all-categories" className="mb-8 mt-8 scroll-mt-24">
      <div className="flex items-center justify-between mb-4 pl-2 sm:pl-4">
        <h2 onClick={onCategoryClick} className="font-serif text-2xl font-bold text-[#1C3A27] cursor-pointer hover:text-[#D97706] transition-colors">
          Nos Catégories du Terroir
        </h2>
        <span className="text-xs text-[#8B3A2B] font-medium uppercase tracking-wider">Produits 100% Naturels</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E5DFD5] p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categoriesData.map((cat) => (
            <a key={cat.id} href="#" className="group">
              <div className="flex flex-col items-center p-3 rounded-xl hover:bg-[#FAF7F2] transition-colors border border-transparent hover:border-[#E5DFD5]">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 group-hover:bg-[#1C3A27] group-hover:text-white transition-colors ${cat.color}`}>
                  ✋
                </div>
                <span className="text-xs font-semibold text-[#1C3A27] text-center leading-tight">
                  {cat.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}