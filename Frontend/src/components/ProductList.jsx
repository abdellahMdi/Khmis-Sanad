import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products, onAddToCart }) {
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12 px-4 bg-white rounded-3xl border border-[#E8DCCF]">
                <p className="text-[#785D4E] font-medium text-lg">
                    Aucun produit artisanal trouvé pour le moment.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
        </div>
    );
}

export default ProductList;