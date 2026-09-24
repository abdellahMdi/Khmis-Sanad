import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateOrderMutation, useGetCartQuery } from '../api/api';
import { apiErrorMessage, formatMad, groupByShop, whatsappLink } from '../utils/format';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

export default function CheckoutPage() {
    const { data: cart, isError, refetch } = useGetCartQuery();
    const [createOrder] = useCreateOrderMutation();
    const [adresse, setAdresse] = useState('');
    const [error, setError] = useState('');
    const [created, setCreated] = useState(null);
    const navigate = useNavigate();

    if (!cart && !isError) {
        return null;
    }
    if (isError) {
        return <ErrorState onRetry={refetch} />;
    }

    const items = cart?.items || [];
    if (!created && items.length === 0) {
        return (
            <EmptyState
                title="Panier vide"
                action={
                    <Link to="/produits">
                        <Button>Retour au catalogue</Button>
                    </Link>
                }
            />
        );
    }

    const groups = groupByShop(items);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!adresse.trim()) {
            setError('L’adresse de livraison est requise.');
            return;
        }
        try {
            const result = await createOrder({
                adresse_livraison: adresse.trim(),
            }).unwrap();
            setCreated(result.data || result);
        } catch (err) {
            setError(apiErrorMessage(err, 'Commande impossible.'));
        }
    };

    if (created) {
        const orders = Array.isArray(created) ? created : [created];
        return (
            <div className="space-y-6">
                <h1 className="text-2xl sm:text-3xl">Commande confirmée</h1>
                <p className="text-encre-muted">
                    Une commande a été créée par boutique. Paiement et livraison se
                    finalisent directement avec l’artisan sur WhatsApp.
                </p>
                {orders.map((order) => {
                    const wa = whatsappLink(
                        order.whatsapp_number,
                        `Bonjour, je viens de passer la commande #${order.id} sur Khmis Sanad.`
                    );
                    return (
                        <div key={order.id} className="rounded-xl bg-sable-50 p-4">
                            <p className="font-semibold">Commande #{order.id}</p>
                            <p>{formatMad(order.total)}</p>
                            {wa ? (
                                <a
                                    href={wa}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-block text-zellige underline"
                                >
                                    Contacter sur WhatsApp
                                </a>
                            ) : null}
                        </div>
                    );
                })}
                <Button onClick={() => navigate('/commandes')}>
                    Voir mes commandes
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <div>
                <h1 className="text-2xl sm:text-3xl">Commande</h1>
                {groups.map((group) => (
                    <section key={group.shop?.id || 'x'} className="mt-4">
                        <h2 className="font-display text-xl">
                            {group.shop?.name}
                        </h2>
                        <ul className="mt-2 text-sm text-encre-muted">
                            {group.items.map((item) => (
                                <li key={item.id}>
                                    {item.product?.name} × {item.quantite} —{' '}
                                    {formatMad(item.subtotal)}
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
                <p className="mt-4 font-semibold">Total {formatMad(cart.total)}</p>
            </div>
            <form
                onSubmit={onSubmit}
                className="rounded-xl bg-sable-50 p-4 sm:p-6"
                data-testid="checkout-form"
            >
                <label className="block text-sm">
                    Adresse de livraison
                    <textarea
                        name="adresse_livraison"
                        required
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                        className="mt-1 h-28 w-full rounded-md border border-encre/15 px-3 py-2"
                    />
                </label>
                {error ? (
                    <p role="alert" className="mt-3 text-sm text-henne">
                        {error}
                    </p>
                ) : null}
                <Button type="submit" className="mt-4 w-full">
                    Valider la commande
                </Button>
            </form>
        </div>
    );
}
