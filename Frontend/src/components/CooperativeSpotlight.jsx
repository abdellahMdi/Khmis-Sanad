// components/CooperativeSpotlight.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CooperativeSpotlight() {
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch active cooperatives mapped to ERD 'cooperatives' table
    axios.get('/cooperatives?status=active&limit=3')
      .then(res => setCooperatives(res.data))
      .catch(err => console.error('Error fetching cooperatives:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="bg-[#FAF7F2] py-16 border-y border-[#E5DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-serif font-bold text-[#1C3A27]">Nos Coopératives Partenaires</h2>
          <p className="text-xs text-gray-500 mt-2">
            Chaque achat contribue au développement des régions rurales du Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cooperatives.map((coop) => (
            <div key={coop.id} className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#D97706] font-semibold mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {coop.hq_location || 'Maroc'}
                </div>
                <h3 className="text-lg font-bold text-[#1C3A27] mb-2">{coop.name}</h3>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                  {coop.bio || 'Coopérative artisanale marocaine engagée dans la préservation des arts traditionnels.'}
                </p>
              </div>

              <a
                href={`/cooperatives/${coop.slug || coop.id}`}
                className="text-xs font-bold text-[#1C3A27] hover:text-[#D97706] inline-flex items-center gap-1 transition-colors"
              >
                Découvrir leurs créations →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}