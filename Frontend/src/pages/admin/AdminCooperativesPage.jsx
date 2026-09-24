import { useState } from 'react';
import {
    useApproveShopMutation,
    useBlockShopMutation,
    useGetAdminShopsQuery,
} from '../../api/api';
import { apiErrorMessage } from '../../utils/format';
import ErrorState from '../../components/ErrorState';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Pagination from '../../components/Pagination';

export default function AdminCooperativesPage() {
    const [page, setPage] = useState(1);
    const { data, isError, refetch } = useGetAdminShopsQuery(page);
    const [approve] = useApproveShopMutation();
    const [block] = useBlockShopMutation();
    const [error, setError] = useState('');
    const shops = data?.data || [];

    if (!data && !isError) {
        return null;
    }
    if (isError) {
        return <ErrorState onRetry={refetch} />;
    }

    const onApprove = async (id) => {
        setError('');
        try {
            await approve(id).unwrap();
        } catch (err) {
            setError(apiErrorMessage(err, 'Impossible d’approuver sans justificatif.'));
        }
    };

    const onBlock = async (id) => {
        setError('');
        try {
            await block(id).unwrap();
        } catch (err) {
            setError(apiErrorMessage(err));
        }
    };

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl">Coopératives</h1>
            <p className="mt-2 max-w-2xl text-sm text-encre-muted">
                Consultez le justificatif avant d’accepter une boutique. Sans fichier,
                l’approbation est refusée. Vous pouvez aussi bloquer une coopérative.
            </p>
            {error ? (
                <p role="alert" className="mt-4 rounded-lg bg-henne/10 px-3 py-2 text-sm text-henne">
                    {error}
                </p>
            ) : null}
            <ul className="mt-6 space-y-3">
                {shops.map((shop) => (
                    <li
                        key={shop.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zellige/10 bg-sable-50 p-5 shadow-souk"
                    >
                        <div>
                            <p className="font-display text-lg">{shop.name}</p>
                            <p className="text-sm text-encre-muted">
                                {shop.owner_email || 'Email non disponible'} ·{' '}
                                {shop.terroir || shop.hq_location || 'Terroir non renseigné'}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge tone={shop.status}>{shop.status}</Badge>
                                <Badge tone={shop.has_proof ? 'approved' : 'henne'}>
                                    {shop.has_proof ? 'Justificatif reçu' : 'Justificatif manquant'}
                                </Badge>
                            </div>
                            {shop.proof_url ? (
                                <a
                                    href={shop.proof_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-block text-sm font-medium text-zellige underline"
                                >
                                    Ouvrir le justificatif
                                </a>
                            ) : (
                                <p className="mt-2 text-sm text-henne">
                                    Impossible d’accepter tant que le fichier n’est pas déposé.
                                </p>
                            )}
                        </div>
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                            <Button
                                className="w-full sm:w-auto"
                                onClick={() => onApprove(shop.id)}
                                disabled={!shop.has_proof || shop.status === 'approved'}
                            >
                                Accepter
                            </Button>
                            <Button
                                variant="danger"
                                className="w-full sm:w-auto"
                                onClick={() => onBlock(shop.id)}
                                disabled={shop.status === 'blocked'}
                            >
                                Bloquer
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
            <Pagination meta={data?.meta} onPageChange={setPage} />
        </div>
    );
}
