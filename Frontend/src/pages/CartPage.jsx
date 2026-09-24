import { Link } from 'react-router-dom';
import {
    useDeleteCartItemMutation,
    useGetCartQuery,
    useUpdateCartItemMutation,
} from '../api/api';
import { formatMad, groupByShop } from '../utils/format';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

export default function CartPage() {
    const { data: cart, isError, refetch } = useGetCartQuery();
    const [updateItem] = useUpdateCartItemMutation();
    const [deleteItem] = useDeleteCartItemMutation();

    if (!cart && !isError) {
        return null;
    }
    if (isError) {
        return <ErrorState onRetry={refetch} />;
    }

    const items = cart?.items || [];
    const groups = groupByShop(items);

    if (items.length === 0) {
        return (
            <EmptyState
                title="Votre panier est vide"
                action={
                    <Link to="/produits">
                        <Button>Voir le catalogue</Button>
                    </Link>
                }
            />
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl">Panier</h1>
            {groups.map((group) => (
                <section
                    key={group.shop?.id || 'unknown'}
                    className="rounded-xl bg-sable-50 p-4"
                >
                    <h2 className="font-display text-xl">
                        {group.shop?.name || 'Boutique'}
                    </h2>
                    <p className="text-xs text-olive">{group.shop?.terroir}</p>
                    <ul className="mt-3 divide-y divide-encre/10">
                        {group.items.map((item) => (
                            <li
                                key={item.id}
                                className="flex flex-wrap items-center justify-between gap-3 py-3"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.product?.name}
                                    </p>
                                    <p className="text-sm text-encre-muted">
                                        {formatMad(item.unit_price)} × {item.quantite}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        aria-label={`Quantité ${item.product?.name}`}
                                        value={item.quantite}
                                        onChange={(e) =>
                                            updateItem({
                                                id: item.id,
                                                quantite: Number(e.target.value) || 1,
                                            })
                                        }
                                        className="w-16 rounded-md border border-encre/15 px-2 py-1"
                                    />
                                    <Button
                                        variant="danger"
                                        onClick={() => deleteItem(item.id)}
                                    >
                                        Retirer
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
            <div className="flex flex-col gap-2 rounded-xl bg-zellige px-4 py-4 text-sable-50 sm:flex-row sm:items-center sm:justify-between">
                <span>Total</span>
                <span className="font-display text-2xl">
                    {formatMad(cart.total)}
                </span>
            </div>
            <Link to="/commande" className="block">
                <Button className="w-full sm:w-auto">Valider la commande</Button>
            </Link>
        </div>
    );
}
