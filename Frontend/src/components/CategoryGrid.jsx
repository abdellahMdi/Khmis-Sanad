// components/CategoryGrid.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1C3A27]">Catégories d'Artisanat</h2>
          <p className="text-xs text-gray-500 mt-1">Parcourez les produits par savoir-faire traditionnel</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/catalogue?category=${cat.id}`}
            className="group p-5 bg-white rounded-2xl border border-[#E5DFD5] hover:border-[#D97706] hover:shadow-md transition-all text-center flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#1C3A27] group-hover:bg-[#D97706] group-hover:text-white flex items-center justify-center transition-colors mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#1C3A27] group-hover:text-[#D97706] transition-colors">
              {cat.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}