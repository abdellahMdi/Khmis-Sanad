import { useEffect, useState } from 'react';
import { useGetCategoriesQuery, useGetProductsQuery } from '../api/api';
import { useProductFilters } from '../hooks/useProductFilters';
import ProductCard from '../components/ProductCard';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

export default function CatalogPage() {
    const { filters, apiParams, update } = useProductFilters();
    const [qInput, setQInput] = useState(filters.q);
    const { data: categories } = useGetCategoriesQuery();
    const { data, isError, refetch } = useGetProductsQuery(apiParams);

    useEffect(() => {
        const t = setTimeout(() => {
            if (qInput !== filters.q) {
                update({ q: qInput, page: 1 });
            }
        }, 350);
        return () => clearTimeout(t);
    }, [qInput, filters.q, update]);

    const products = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-accent">
                    Produits du Maroc
                </p>
                <h1 className="section-title mt-1">Notre catalogue</h1>
            </div>
            <form
                className="grid gap-4 rounded-2xl border border-brand-gold/30 bg-white p-4 shadow-sm sm:p-6 md:grid-cols-3"
                onSubmit={(e) => e.preventDefault()}
            >
                <label className="block text-sm font-semibold text-brand-primary">
                    Recherche
                    <input
                        value={qInput}
                        onChange={(e) => setQInput(e.target.value)}
                        className="input-field mt-1.5 font-normal"
                        placeholder="Argan, safran, miel…"
                    />
                </label>
                <label className="block text-sm font-semibold text-brand-primary">
                    Catégorie
                    <select
                        value={filters.categorie}
                        onChange={(e) => update({ categorie: e.target.value })}
                        className="input-field mt-1.5 font-normal"
                    >
                        <option value="">Toutes</option>
                        {(categories || []).map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="block text-sm font-semibold text-brand-primary">
                    Prix minimum (MAD)
                    <input
                        type="number"
                        min="0"
                        value={filters.prix_min}
                        onChange={(e) => update({ prix_min: e.target.value })}
                        className="input-field mt-1.5 font-normal"
                    />
                </label>
            </form>

            {isError ? (
                <ErrorState onRetry={refetch} />
            ) : !data ? null : products.length === 0 ? (
                <EmptyState title="Aucun produit">
                    Essayez un autre filtre ou une autre recherche.
                </EmptyState>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {meta?.last_page > 1 ? (
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button
                                variant="ghost"
                                disabled={meta.current_page <= 1}
                                onClick={() =>
                                    update({ page: meta.current_page - 1 })
                                }
                            >
                                Précédent
                            </Button>
                            <span className="self-center text-sm text-encre-muted">
                                {meta.current_page} / {meta.last_page}
                            </span>
                            <Button
                                variant="ghost"
                                disabled={meta.current_page >= meta.last_page}
                                onClick={() =>
                                    update({ page: meta.current_page + 1 })
                                }
                            >
                                Suivant
                            </Button>
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
}
