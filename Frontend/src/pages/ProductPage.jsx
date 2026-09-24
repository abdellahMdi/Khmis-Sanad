import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAddCartItemMutation, useGetProductQuery } from '../api/api';
import { selectAuth } from '../store/authSlice';
import { formatMad, whatsappLink } from '../utils/format';
import ErrorState from '../components/ErrorState';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import Badge from '../components/Badge';
import ReviewForm from '../components/ReviewForm';

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { role } = useSelector(selectAuth);
    const { data: product, isError, refetch } = useGetProductQuery(id);
    const [addItem] = useAddCartItemMutation();
    const [qty, setQty] = useState(1);

    if (!product && !isError) {
        return null;
    }
    if (isError || !product) {
        return <ErrorState onRetry={refetch} message="Produit introuvable." />;
    }

    const images = product.images?.length
        ? product.images
        : [{ url: 'https://picsum.photos/seed/terroir/800/800', order: 1 }];
    const wa = whatsappLink(
        product.whatsapp_number,
        `Bonjour, je m'intéresse à ${product.name}`
    );

    const addToCart = async () => {
        if (role !== 'client') {
            navigate('/login', {
                state: { from: { pathname: `/produits/${id}` } },
            });
            return;
        }
        await addItem({ product_id: product.id, quantite: qty }).unwrap();
        navigate('/panier');
    };

    return (
        <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="min-w-0 space-y-3">
                <img
                    src={images[0].url}
                    alt={product.name}
                    className="aspect-[4/3] w-full rounded-2xl border border-brand-gold/25 bg-white object-cover shadow-sm sm:aspect-auto sm:max-h-[28rem]"
                />
                {images.length > 1 ? (
                    <div className="grid grid-cols-4 gap-2">
                        {images.map((img) => (
                            <img
                                key={img.id || img.url}
                                src={img.url}
                                alt=""
                                className="h-20 w-full rounded-xl border border-brand-gold/25 object-cover"
                            />
                        ))}
                    </div>
                ) : null}
            </div>
            <div className="min-w-0 rounded-2xl border border-brand-gold/30 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand-primary/70">
                    {product.shop?.name}
                </p>
                <h1 className="mt-2 text-2xl font-extrabold text-brand-text sm:text-3xl">{product.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="text-2xl font-bold text-brand-accent sm:text-3xl">
                        {formatMad(product.price)}
                    </span>
                    {product.prix_remise ? (
                        <span className="text-encre-muted line-through">
                            {formatMad(product.prix)}
                        </span>
                    ) : null}
                    <Badge tone={product.stock > 0 ? 'olive' : 'henne'}>
                        {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                    </Badge>
                </div>
                <p className="mt-5 leading-relaxed text-encre-muted">{product.description}</p>
                {product.producer_story ? (
                    <blockquote className="mt-6 rounded-r-xl border-l-4 border-brand-gold bg-brand-bg p-4 text-brand-text">
                        <p className="text-lg font-bold text-brand-primary">Histoire du producteur</p>
                        <p className="mt-2 text-sm">{product.producer_story}</p>
                        {product.shop?.terroir ? (
                            <p className="mt-2 text-xs uppercase tracking-wide text-olive">
                                {product.shop.terroir}
                            </p>
                        ) : null}
                    </blockquote>
                ) : null}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <label className="text-sm">
                        Quantité
                        <input
                            type="number"
                            min="1"
                            max={product.stock}
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value) || 1)}
                            className="input-field ml-2 inline-block w-20 px-2 py-1.5 text-sm"
                        />
                    </label>
                    <Button
                        variant="accent"
                        className="w-full sm:w-auto"
                        onClick={addToCart}
                        disabled={product.stock < 1}
                    >
                        Ajouter au panier
                    </Button>
                    {wa ? (
                        <a
                            href={wa}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-bold text-brand-primary underline decoration-brand-gold decoration-2 underline-offset-4 hover:text-brand-accent"
                        >
                            Contacter la coopérative
                        </a>
                    ) : null}
                </div>
                <div className="mt-8 space-y-4">
                    <h2 className="text-xl font-bold text-brand-primary">Avis clients</h2>
                    <ReviewForm product={product} role={role} />
                    {product.reviews?.length ? (
                        product.reviews.map((review) => (
                            <div
                                key={review.id}
                                className="rounded-xl border border-brand-gold/25 bg-brand-bg p-4"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <RatingStars value={review.note} />
                                    {review.user ? (
                                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary/70">
                                            {review.user.firstname} {review.user.lastname}
                                        </p>
                                    ) : null}
                                </div>
                                {review.comment ? (
                                    <p className="mt-2 text-sm leading-relaxed text-brand-text">
                                        {review.comment}
                                    </p>
                                ) : null}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-encre-muted">
                            Aucun avis publié pour le moment.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
