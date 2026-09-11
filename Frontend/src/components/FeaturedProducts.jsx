// components/FeaturedProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetches products with relations: product_img, cooperative, and avis
    axios.get('/products?featured=true')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/panier/items', 
        { product_id: productId, quantite: 1 },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      alert('Produit ajouté au panier !');
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1C3A27]">Dernières Créations</h2>
          <p className="text-xs text-gray-500 mt-1">Sélection de produits fait main authentiques</p>
        </div>
        <a href="/catalogue" className="text-xs font-bold text-[#D97706] hover:underline">
          Voir tout →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => {
          // Extract image order 1 or first available from ERD 'product_img'
          const mainImg = product.product_img?.find(img => img.order === 1)?.url || product.product_img?.[0]?.url || 'https://via.placeholder.com/300';
          
          // Calculate average review note from ERD 'avis' table
          const avgNote = product.avis?.length 
            ? (product.avis.reduce((sum, a) => sum + a.note, 0) / product.avis.length).toFixed(1)
            : null;

          return (
            <div key={product.id} className="bg-white rounded-2xl border border-[#E5DFD5] overflow-hidden group hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.prix_remise && (
                    <span className="absolute top-3 left-3 bg-[#8B3A2B] text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      Promo
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <span className="text-[10px] text-[#D97706] font-semibold uppercase tracking-wider block mb-1">
                    {product.cooperative?.name || 'Artisanat Local'}
                  </span>
                  <h3 className="text-sm font-bold text-[#1C3A27] truncate mb-1">
                    {product.name}
                  </h3>
                  
                  {avgNote && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-2">
                      <span className="text-amber-500">★</span>
                      <span>{avgNote}</span>
                      <span>({product.avis.length})</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between border-t border-[#FAF7F2] mt-2">
                <div>
                  {product.prix_remise ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#8B3A2B]">{product.prix_remise} DH</span>
                      <span className="text-xs text-gray-400 line-through">{product.prix} DH</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-[#1C3A27]">{product.prix} DH</span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="p-2 bg-[#1C3A27] hover:bg-[#D97706] text-white rounded-xl transition-colors"
                  title="Ajouter au panier"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}