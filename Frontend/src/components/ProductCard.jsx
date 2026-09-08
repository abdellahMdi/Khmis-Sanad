import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import StarRating from './StarRating';
import { getProductImageUrl } from '../utils/imageUtils';

function ProductCard({ product, onAddToCart }) {
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();

    const imageUrl = getProductImageUrl(product);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading || user?.role === 'admin') return;

        try {
            setLoading(true);

            if (typeof onAddToCart === 'function') {
                await onAddToCart(product);
            } else if (addToCart) {
                await addToCart(product, 1);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Link
            to={`/product/${product.slug || product.id}`}
            className="group block h-full"
            aria-label={`Voir ${product.name || product.title}`}
        >
            <div className="h-full flex flex-col overflow-hidden bg-white rounded-3xl border border-[#E8DCCF] shadow-sm hover:shadow-md transition-all duration-200">
                {/* Image Container */}
                <div className="relative h-56 md:h-60 overflow-hidden bg-[#FAF5EF]">
                    <img
                        src={imageUrl}
                        alt={product.name || product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/no-image.webp';
                        }}
                    />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                        <h3 className="text-lg font-bold text-[#4A3B32] line-clamp-1 group-hover:text-[#C2591A] transition-colors">
                            {product.name || product.title}
                        </h3>

                        <div className="flex items-center gap-2 mt-2">
                            <StarRating rating={product.reviews_avg_rating || 0} />
                            <span className="text-xs text-[#785D4E]">
                                ({product.reviews_count || 0})
                            </span>
                            {product.order_items_count > 0 && (
                                <span className="text-xs text-[#785D4E] ml-auto">
                                    Vendus: {product.order_items_count}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#FAF5EF]">
                        <div>
                            <span className="text-xl font-extrabold text-[#A04000]">
                                {new Intl.NumberFormat('fr-MA').format(product.price)}
                            </span>
                            <span className="text-xs font-semibold text-[#A04000] ml-1">DH</span>
                        </div>

                        <button
                            className={`flex items-center justify-center p-2.5 rounded-full bg-[#C2591A] text-white shadow-sm transition-all ${
                                loading || user?.role === 'admin'
                                    ? 'opacity-60 cursor-not-allowed'
                                    : 'hover:bg-[#A04000] active:scale-95'
                            }`}
                            onClick={handleAddToCart}
                            disabled={loading || user?.role === 'admin'}
                            aria-label="Ajouter au panier"
                            title={
                                user?.role === 'admin'
                                    ? 'Les administrateurs ne peuvent pas ajouter au panier'
                                    : 'Ajouter au panier'
                            }
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <ShoppingCart size={18} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;