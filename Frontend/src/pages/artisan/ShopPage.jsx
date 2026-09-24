import { useEffect, useState } from 'react';
import { useGetShopQuery, useUpdateShopMutation, useUploadShopProofMutation } from '../../api/api';
import { apiErrorMessage } from '../../utils/format';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

export default function ShopPage() {
    const { data: shop, isError, refetch } = useGetShopQuery();
    const [updateShop] = useUpdateShopMutation();
    const [uploadProof] = useUploadShopProofMutation();
    const [form, setForm] = useState({ name: '', bio: '', terroir: '' });
    const [proofFile, setProofFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (shop) {
            setForm({
                name: shop.name || '',
                bio: shop.bio || '',
                terroir: shop.terroir || shop.hq_location || '',
            });
        }
    }, [shop]);

    if (!shop && !isError) {
        return null;
    }
    if (isError) {
        return <ErrorState onRetry={refetch} />;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await updateShop(form).unwrap();
            setMessage('Boutique mise à jour.');
        } catch (err) {
            setError(apiErrorMessage(err));
        }
    };

    const onUploadProof = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!proofFile) {
            setError('Choisissez un fichier PDF, JPG ou PNG.');
            return;
        }
        try {
            await uploadProof(proofFile).unwrap();
            setProofFile(null);
            e.target.reset?.();
            setMessage('Justificatif envoyé. L’administration pourra maintenant valider votre boutique.');
        } catch (err) {
            setError(apiErrorMessage(err));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl">Ma boutique</h1>
                <Badge tone={shop.status}>{shop.status}</Badge>
            </div>

            <section className="rounded-2xl border border-terracotta/20 bg-gradient-to-br from-safran-light/40 via-sable-50 to-white p-4 shadow-souk sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
                    Justificatif obligatoire
                </p>
                <h2 className="mt-1 font-display text-2xl">Dossier de la coopérative</h2>
                <p className="mt-2 max-w-2xl text-sm text-encre-muted">
                    Déposez un document officiel (statuts, attestation, pièce d’identité
                    du responsable) en PDF, JPG ou PNG (5 Mo max). Sans ce fichier,
                    l’équipe ne peut ni accepter ni publier votre boutique.
                </p>
                {shop.has_proof ? (
                    <p className="mt-3 text-sm font-medium text-olive">
                        Un justificatif est déjà en ligne.
                        {shop.proof_url ? (
                            <>
                                {' '}
                                <a
                                    href={shop.proof_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-zellige underline"
                                >
                                    Voir le fichier
                                </a>
                            </>
                        ) : null}
                    </p>
                ) : (
                    <p className="mt-3 rounded-lg bg-henne/10 px-3 py-2 text-sm text-henne">
                        Aucun justificatif déposé — votre dossier reste en attente.
                    </p>
                )}
                <form onSubmit={onUploadProof} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label className="block flex-1 text-sm">
                        Fichier
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                            onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                            className="input-field mt-1 file:mr-3 file:rounded-md file:border-0 file:bg-zellige file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
                        />
                    </label>
                    <Button type="submit" variant="secondary">
                        {shop.has_proof ? 'Remplacer' : 'Envoyer'}
                    </Button>
                </form>
            </section>

            <form onSubmit={onSubmit} className="card-panel max-w-xl space-y-4">
                <h2 className="font-display text-xl">Informations publiques</h2>
                <label className="block text-sm">
                    Nom
                    <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-field mt-1"
                    />
                </label>
                <label className="block text-sm">
                    Terroir d’origine
                    <input
                        value={form.terroir}
                        onChange={(e) => setForm({ ...form, terroir: e.target.value })}
                        className="input-field mt-1"
                    />
                </label>
                <label className="block text-sm">
                    Biographie
                    <textarea
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        className="input-field mt-1 h-32"
                    />
                </label>
                {error ? <p className="text-sm text-henne">{error}</p> : null}
                {message ? <p className="text-sm text-olive">{message}</p> : null}
                <Button type="submit" disabled={shop.status === 'blocked'}>
                    Enregistrer
                </Button>
            </form>
        </div>
    );
}
