import { useGetShopOrdersQuery } from '../../api/api';
import { formatMad } from '../../utils/format';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import Badge from '../../components/Badge';

export default function ShopOrdersPage() {
    const { data, isError, refetch } = useGetShopOrdersQuery();
    const orders = data?.data || [];

    if (!data && !isError) {
        return null;
    }
    if (isError) {
        return <ErrorState onRetry={refetch} />;
    }
    if (orders.length === 0) {
        return <EmptyState title="Aucune commande reçue" />;
    }

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl">Commandes reçues</h1>
            <ul className="mt-6 space-y-3">
                {orders.map((order) => (
                    <li key={order.id} className="rounded-xl bg-sable-50 p-4">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">#{order.id}</p>
                            <Badge>{order.statut}</Badge>
                        </div>
                        <p>{formatMad(order.total)}</p>
                        <ul className="mt-2 text-sm text-encre-muted">
                            {(order.lignes || []).map((ligne) => (
                                <li key={ligne.id}>
                                    {ligne.product?.name} × {ligne.quantity}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}
