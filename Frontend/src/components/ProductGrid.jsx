import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Bonjour Khmissa Sanad, je souhaite me renseigner/commander le produit "${product.name}" (${product.price} DH) auprès de ${product.seller}.`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5DFD5] overflow-hidden shadow-sm hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative h-52 overflow-hidden bg-[#FAF7F2] flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <span className="text-6xl">{product.icon || '🛍️'}</span>
        )}
        <span
          className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
          style={{ background: product.badgeBg }}
        >
          {product.badge}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D97706]"></span>
          <span className="text-xs font-bold text-[#D97706]">{product.seller}</span>
        </div>
        <div className="text-xs text-[#8B3A2B] mb-1">{product.location}</div>
        <h3 className="font-serif font-bold text-[#1C3A27] text-base mb-1 leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 flex-1 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-end justify-between mb-3">
          <div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through leading-none mb-0.5">
                {product.originalPrice} DH
              </div>
            )}
            <span className="font-bold text-lg text-[#8B3A2B]">
              {product.price} <span className="text-xs font-normal">DH</span>
            </span>
          </div>
          <div className="text-xs font-medium text-[#D97706]">
            ★ {product.rating} <span className="text-gray-400 font-normal">({product.reviewsCount} avis)</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(product.name)}
            className="flex-1 bg-[#1C3A27] hover:bg-[#142A1C] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Ajouter
          </button>
          <button
            onClick={handleWhatsApp}
            className="bg-[#25D366] hover:bg-[#1ebd59] text-white p-2.5 rounded-xl transition-colors"
            title="Commander via WhatsApp"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}