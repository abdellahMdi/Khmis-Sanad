import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../api/api';
import { formatMad } from '../utils/format';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';

export default function OrdersPage() {
    const { data, isError, refetch } = useGetOrdersQuery();
    const orders = data?.data || [];

    if (!data && !isError) {
        return null;
    }
    if (isError) {
        return <ErrorState onRetry={refetch} />;
    }
    if (orders.length === 0) {
        return <EmptyState title="Aucune commande" />;
    }

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl">Mes commandes</h1>
            <ul className="mt-6 space-y-3">
                {orders.map((order) => (
                    <li key={order.id}>
                        <Link
                            to={`/commandes/${order.id}`}
                            className="flex flex-col gap-2 rounded-xl bg-sable-50 p-4 hover:ring-1 hover:ring-terracotta sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-semibold">Commande #{order.id}</p>
                                <p className="text-sm text-encre-muted">
                                    {order.created_at
                                        ? new Date(order.created_at).toLocaleDateString('fr-FR')
                                        : ''}
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p>{formatMad(order.total)}</p>
                                <Badge>{order.statut}</Badge>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
