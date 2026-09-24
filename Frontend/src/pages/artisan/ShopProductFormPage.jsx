import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useCreateShopProductMutation,
    useGetCategoriesQuery,
    useGetShopProductQuery,
    useUpdateShopProductMutation,
} from '../../api/api';
import { apiErrorMessage } from '../../utils/format';
import Button from '../../components/Button';
import ErrorState from '../../components/ErrorState';

const empty = {
    name: '',
    description: '',
    prix: '',
    prix_remise: '',
    stock: 0,
    cat_id: '',
    imagesText: '',
};

export default function ShopProductFormPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { data: categories } = useGetCategoriesQuery();
    const {
        data: product,
        isError,
        refetch,
    } = useGetShopProductQuery(id, { skip: !isEdit });
    const [createProduct] = useCreateShopProductMutation();
    const [updateProduct] = useUpdateShopProductMutation();
    const [form, setForm] = useState(empty);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit || !product) {
            return;
        }
        setForm({
            name: product.name,
            description: product.description || '',
            prix: product.prix,
            prix_remise: product.prix_remise || '',
            stock: product.stock,
            cat_id: product.category?.id || '',
            imagesText: (product.images || []).map((i) => i.url).join('\n'),
        });
    }, [isEdit, product]);

    if (isEdit && !product && !isError) {
        return null;
    }
    if (isEdit && isError) {
        return <ErrorState message="Produit introuvable ou inaccessible." onRetry={refetch} />;
    }

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.prix || !form.cat_id) {
            setError('Nom, prix et catégorie sont requis.');
            return;
        }
        const images = form.imagesText
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
        const payload = {
            name: form.name,
            description: form.description,
            prix: Number(form.prix),
            prix_remise: form.prix_remise === '' ? null : Number(form.prix_remise),
            stock: Number(form.stock),
            cat_id: Number(form.cat_id),
            images,
        };
        try {
            if (isEdit) {
                await updateProduct({ id, ...payload }).unwrap();
            } else {
                await createProduct(payload).unwrap();
            }
            navigate('/artisan/produits');
        } catch (err) {
            setError(apiErrorMessage(err));
        }
    };

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl">{isEdit ? 'Éditer le produit' : 'Nouveau produit'}</h1>
            <p className="mt-2 text-sm text-encre-muted">
                Pas d’upload fichier côté API : collez une URL d’image par ligne
                (`product_img.url`).
            </p>
            <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-4">
                <label className="block text-sm">
                    Nom
                    <input
                        value={form.name}
                        onChange={set('name')}
                        className="mt-1 w-full rounded-md border border-encre/15 px-3 py-2"
                    />
                </label>
                <label className="block text-sm">
                    Description
                    <textarea
                        value={form.description}
                        onChange={set('description')}
                        className="mt-1 h-24 w-full rounded-md border border-encre/15 px-3 py-2"
                    />
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm">
                        Prix
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.prix}
                            onChange={set('prix')}
                            className="mt-1 w-full rounded-md border border-encre/15 px-3 py-2"
                        />
                    </label>
                    <label className="text-sm">
                        Prix remisé
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.prix_remise}
                            onChange={set('prix_remise')}
                            className="mt-1 w-full rounded-md border border-encre/15 px-3 py-2"
                        />
                    </label>
                </div>
                <label className="block text-sm">
                    Stock
                    <input
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={set('stock')}
                        className="mt-1 w-full rounded-md border border-encre/15 px-3 py-2"
                    />
                </label>
                <label className="block text-sm">
                    Catégorie
                    <select
                        value={form.cat_id}
                        onChange={set('cat_id')}
                        className="mt-1 w-full rounded-md border border-encre/15 px-3 py-2"
                    >
                        <option value="">Choisir</option>
                        {(categories || []).map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="block text-sm">
                    URLs d’images (une par ligne)
                    <textarea
                        value={form.imagesText}
                        onChange={set('imagesText')}
                        className="mt-1 h-24 w-full rounded-md border border-encre/15 px-3 py-2"
                    />
                </label>
                {error ? <p className="text-sm text-henne">{error}</p> : null}
                <Button type="submit">Enregistrer</Button>
            </form>
        </div>
    );
}
