import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useProductFilters() {
    const [params, setParams] = useSearchParams();

    const filters = useMemo(() => {
        const page = Number.parseInt(params.get('page') || '1', 10);
        const prixMin = params.get('prix_min');
        return {
            categorie: params.get('categorie') || '',
            prix_min: prixMin ? Number(prixMin) : '',
            q: params.get('q') || '',
            page: Number.isFinite(page) && page > 0 ? page : 1,
        };
    }, [params]);

    const apiParams = useMemo(() => {
        const query = { page: filters.page, per_page: 12 };
        if (filters.categorie) {
            query.category = filters.categorie;
        }
        if (filters.prix_min !== '') {
            query.min_price = filters.prix_min;
        }
        if (filters.q) {
            query.q = filters.q;
        }
        return query;
    }, [filters]);

    const update = useCallback(
        (patch) => {
            const next = new URLSearchParams(params);
            Object.entries(patch).forEach(([key, value]) => {
                if (value === '' || value === null || value === undefined) {
                    next.delete(key);
                } else {
                    next.set(key, String(value));
                }
            });
            if (!Object.prototype.hasOwnProperty.call(patch, 'page')) {
                next.set('page', '1');
            }
            setParams(next);
        },
        [params, setParams]
    );

    return { filters, apiParams, update };
}
