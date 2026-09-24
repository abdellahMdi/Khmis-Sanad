import { Link } from 'react-router-dom';
import { useGetCategoriesQuery, useGetProductsQuery } from '../api/api';
import ProductCard from '../components/ProductCard';
import ErrorState from '../components/ErrorState';
import Button from '../components/Button';

export default function HomePage() {
    const { data: categories, isError: catError, refetch: refetchCats } =
        useGetCategoriesQuery();
    const { data, isError, refetch } = useGetProductsQuery({
        per_page: 6,
    });
    const products = data?.data || [];

    return (
        <div className="space-y-10 md:space-y-16">
            <section className="relative overflow-hidden rounded-2xl border border-brand-accent/15 bg-white px-4 py-8 shadow-sm sm:rounded-3xl sm:px-6 sm:py-12 md:px-12 md:py-16">
                <div className="relative grid items-center gap-6 md:grid-cols-[1.15fr_0.85fr] md:gap-10">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent sm:text-sm">
                            Coopératives du Maroc
                        </p>
                        <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-[1.1] text-brand-text sm:mt-4 sm:text-4xl md:text-5xl">
                            Le goût du terroir, directement chez vous.
                        </h1>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-encre-muted sm:mt-5 sm:text-base">
                            Huiles d’argan, safran de Taliouine et miels de l’Atlas,
                            sélectionnés auprès d’artisans et de coopératives vérifiés.
                        </p>
                        <Link to="/produits" className="inline-block w-full sm:w-auto">
                            <Button variant="accent" className="mt-6 w-full sm:mt-8 sm:w-auto">
                                Explorer le catalogue
                            </Button>
                        </Link>
                    </div>
                    <img
                        src="/myassets/biglogo.png"
                        alt="Coopérative Sanad"
                        className="mx-auto max-h-44 w-auto object-contain sm:max-h-72 md:max-h-80"
                    />
                </div>
            </section>

            <section>
                <div className="mb-6">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-accent">
                        Le meilleur du terroir
                    </p>
                    <h2 className="section-title mt-1">Catégories phares</h2>
                </div>
                {catError ? (
                    <ErrorState onRetry={refetchCats} />
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
                        {(categories || []).map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/produits?categorie=${encodeURIComponent(cat.name)}`}
                                className="rounded-2xl border border-brand-gold/30 bg-white p-3 text-center text-sm shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-accent/40 hover:shadow-md sm:p-6 sm:text-base"
                            >
                                <span className="font-bold text-brand-primary">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-accent">
                            Sélection artisanale
                        </p>
                        <h2 className="section-title mt-1">Produits mis en avant</h2>
                    </div>
                    <Link
                        to="/produits"
                        className="shrink-0 text-sm font-bold text-brand-primary hover:text-brand-accent"
                    >
                        Voir tout
                    </Link>
                </div>
                {isError ? (
                    <ErrorState onRetry={refetch} />
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
