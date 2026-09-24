import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCreateReviewMutation } from '../api/api';
import { apiErrorMessage } from '../utils/format';
import Button from './Button';
import RatingStars from './RatingStars';

export default function ReviewForm({ product, role }) {
    const location = useLocation();
    const [note, setNote] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [createReview] = useCreateReviewMutation();

    const viewer = product.viewer || {};
    const loginState = { from: { pathname: location.pathname } };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!note) {
            setError('Choisissez une note de 1 à 5.');
            return;
        }
        try {
            await createReview({
                product_id: product.id,
                note,
                comment: comment.trim() || null,
            }).unwrap();
            setSubmitted(true);
            setComment('');
        } catch (err) {
            setError(apiErrorMessage(err, 'Impossible d’envoyer l’avis.'));
        }
    };

    if (submitted || viewer.has_reviewed) {
        return (
            <p className="rounded-xl border border-brand-gold/30 bg-brand-bg px-4 py-3 text-sm text-brand-primary">
                Merci. Votre avis est en attente de validation et apparaîtra une fois
                approuvé.
            </p>
        );
    }

    if (viewer.can_review) {
        return (
            <form
                onSubmit={onSubmit}
                className="rounded-xl border border-brand-gold/30 bg-brand-bg p-4"
            >
                <p className="text-sm font-bold text-brand-primary">Laisser un avis</p>
                <p className="mt-1 text-xs text-encre-muted">
                    Notez ce produit. Un commentaire aide les autres clients du souk.
                </p>
                <div className="mt-3">
                    <RatingStars value={note} onChange={setNote} />
                </div>
                <label className="mt-3 block text-sm font-semibold text-brand-text">
                    Commentaire
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        maxLength={2000}
                        className="input-field mt-1.5 font-normal"
                        placeholder="Goût, texture, origine…"
                    />
                </label>
                {error ? (
                    <p role="alert" className="mt-2 text-sm text-henne">
                        {error}
                    </p>
                ) : null}
                <Button type="submit" variant="accent" className="mt-3 w-full sm:w-auto">
                    Publier l’avis
                </Button>
            </form>
        );
    }

    if (role === 'client') {
        return (
            <p className="text-sm text-encre-muted">
                Vous pourrez laisser un avis après avoir commandé ce produit.
            </p>
        );
    }

    if (role) {
        return null;
    }

    return (
        <p className="text-sm text-encre-muted">
            <Link
                to="/login"
                state={loginState}
                className="font-semibold text-brand-primary underline decoration-brand-gold underline-offset-4"
            >
                Connectez-vous
            </Link>{' '}
            avec un compte client, après un achat, pour laisser un avis.
        </p>
    );
}
