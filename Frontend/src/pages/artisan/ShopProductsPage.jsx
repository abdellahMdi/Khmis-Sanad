import { Link } from 'react-router-dom';
import { useDeleteShopProductMutation, useGetShopProductsQuery } from '../../api/api';
import { formatMad } from '../../utils/format';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';

export default function ShopProductsPage() {
    const { data, isError, refetch } = useGetShopProductsQuery();
    const [remove] = useDeleteShopProductMutation();
    const products = data?.data || [];

    if (!data && !isError) {
        return null;
    }
    if (isError) {
        return <ErrorState onRetry={refetch} />;
    }

    return (
        <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl">Produits</h1>
                <Link to="/artisan/produits/nouveau" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto">Nouveau produit</Button>
                </Link>
            </div>
            <ul className="space-y-3">
                {products.map((product) => (
                    <li
                        key={product.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-sable-50 p-4"
                    >
                        <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-encre-muted">
                                {formatMad(product.price)} · stock {product.stock}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link to={`/artisan/produits/${product.id}/edit`}>
                                <Button variant="secondary">Éditer</Button>
                            </Link>
                            <Button variant="danger" onClick={() => remove(product.id)}>
                                Supprimer
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
