import { Link } from 'react-router-dom';
import { formatMad } from '../utils/format';
import Button from './Button';

export default function ProductCard({ product, onAdd }) {
    const image = product.images?.[0]?.url;
    const hasDiscount = Boolean(product.prix_remise);

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-brand-gold/25 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-accent/30 hover:shadow-md">
            <Link to={`/produits/${product.slug || product.id}`} className="relative block">
                <img
                    src={image || 'https://picsum.photos/seed/terroir/600/400'}
                    alt={product.name}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.035] sm:h-52"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-text/25 via-transparent to-transparent" />
                {hasDiscount ? (
                    <span className="absolute left-3 top-3 rounded-full bg-brand-accent px-3 py-1 text-xs font-bold text-white shadow-sm">
                        Offre
                    </span>
                ) : null}
            </Link>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-primary/70">
                    {product.shop?.name || product.category?.name}
                </p>
                <Link
                    to={`/produits/${product.slug || product.id}`}
                    className="mt-1 text-base font-bold leading-snug text-brand-text transition hover:text-brand-accent sm:text-lg"
                >
                    {product.name}
                </Link>
                <div className="mt-3 flex items-end gap-2">
                    <span className="text-xl font-bold text-brand-accent">
                        {formatMad(product.price ?? product.prix_remise ?? product.prix)}
                    </span>
                    {hasDiscount ? (
                        <span className="text-sm text-encre-muted line-through">
                            {formatMad(product.prix)}
                        </span>
                    ) : null}
                </div>
                {onAdd ? (
                    <Button
                        variant="accent"
                        className="mt-4 w-full"
                        disabled={product.stock < 1}
                        onClick={() => onAdd(product)}
                    >
                        {product.stock < 1 ? 'Rupture' : 'Ajouter au panier'}
                    </Button>
                ) : null}
            </div>
        </article>
    );
}
