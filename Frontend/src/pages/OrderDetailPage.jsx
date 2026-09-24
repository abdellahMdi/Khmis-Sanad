import { Link, useParams } from 'react-router-dom';
import { useGetOrderQuery } from '../api/api';
import { formatMad, groupByShop, whatsappLink } from '../utils/format';
import ErrorState from '../components/ErrorState';
import Badge from '../components/Badge';

export default function OrderDetailPage() {
    const { id } = useParams();
    const orderId = Number.parseInt(id, 10);
    const isValidOrderId = Number.isInteger(orderId) && orderId > 0;
    const { data: order, isError, refetch } = useGetOrderQuery(orderId, {
        skip: !isValidOrderId,
    });

    if (!isValidOrderId) {
        return <ErrorState message="Numéro de commande invalide." />;
    }
    if (!order && !isError) {
        return null;
    }
    if (isError || !order) {
        return <ErrorState onRetry={refetch} />;
    }

    const groups = groupByShop(order.lignes || [], (ligne) => ligne.product);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl">Commande #{order.id}</h1>
                <Badge>{order.statut}</Badge>
            </div>
            <p className="text-encre-muted">{order.adresse_livraison}</p>
            <p className="font-semibold">{formatMad(order.total)}</p>
            {groups.map((group) => {
                const wa = whatsappLink(
                    group.shop?.whatsapp_number || order.whatsapp_number,
                    `Bonjour, au sujet de la commande #${order.id}`
                );
                return (
                    <section key={group.shop?.id || 'shop'} className="rounded-xl bg-sable-50 p-4">
                        <h2 className="font-display text-xl">
                            {group.shop?.name || 'Boutique'}
                        </h2>
                        <ul className="mt-2 text-sm">
                            {group.items.map((ligne) => (
                                <li
                                    key={ligne.id}
                                    className="flex flex-wrap items-center justify-between gap-2"
                                >
                                    <span>
                                        {ligne.product?.name} × {ligne.quantity} —{' '}
                                        {formatMad(ligne.subtotal)}
                                    </span>
                                    {ligne.product ? (
                                        <Link
                                            to={`/produits/${ligne.product.slug || ligne.product.id}`}
                                            className="text-xs font-bold text-brand-accent hover:underline"
                                        >
                                            Laisser un avis
                                        </Link>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                        {wa ? (
                            <a
                                href={wa}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-block text-sm font-semibold text-zellige underline"
                            >
                                Contacter sur WhatsApp
                            </a>
                        ) : null}
                    </section>
                );
            })}
        </div>
    );
}
