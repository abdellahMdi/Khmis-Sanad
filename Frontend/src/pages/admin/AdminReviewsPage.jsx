import {
    useApproveReviewMutation,
    useDeleteReviewMutation,
    useGetPendingReviewsQuery,
} from '../../api/api';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import RatingStars from '../../components/RatingStars';

export default function AdminReviewsPage() {
    const { data, isError, refetch } = useGetPendingReviewsQuery();
    const [approve] = useApproveReviewMutation();
    const [remove] = useDeleteReviewMutation();
    const reviews = data?.data || [];

    if (!data && !isError) {
        return null;
    }
    if (isError) {
        return <ErrorState onRetry={refetch} />;
    }
    if (reviews.length === 0) {
        return <EmptyState title="Aucun avis en attente" />;
    }

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl">Avis à modérer</h1>
            <ul className="mt-6 space-y-3">
                {reviews.map((review) => (
                    <li key={review.id} className="rounded-xl bg-sable-50 p-4">
                        <RatingStars value={review.note} />
                        <p className="mt-2">{review.comment}</p>
                        <p className="text-sm text-encre-muted">
                            Produit #{review.product_id}
                        </p>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                            <Button className="w-full sm:w-auto" onClick={() => approve(review.id)}>Approuver</Button>
                            <Button variant="danger" className="w-full sm:w-auto" onClick={() => remove(review.id)}>
                                Supprimer
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
