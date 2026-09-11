<?php

namespace App\Http\Services;

use App\Models\Avis;
use App\Models\Product;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AvisService
{
    /**
     * Return paginated approved reviews for a product.
     */
    public function listApproved(Product $product, int $perPage = 10): LengthAwarePaginator
    {
        return $product->avis()
            ->approved()
            ->with('user:id,firstname,lastname')
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Submit a new review (always starts as pending moderation).
     *
     * One review per user per product is enforced.
     *
     * @param  array{note:int, comment:?string} $data
     */
    public function submit(User $user, Product $product, array $data): Avis
    {
        $existing = Avis::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        abort_if($existing, 409, 'You have already reviewed this product.');

        return $product->avis()->create([
            'user_id' => $user->id,
            'note'    => $data['note'],
            'comment' => $data['comment'] ?? null,
            'status'  => 'pending',
        ]);
    }

    /**
     * Moderate a review (admin action).
     *
     * @param  string $status  approved | rejected
     */
    public function moderate(Avis $avis, string $status): Avis
    {
        $avis->update(['status' => $status]);

        return $avis->fresh();
    }

    /**
     * Compute aggregate rating stats for a product.
     *
     * @return array{average: float, count: int, distribution: array<int,int>}
     */
    public function stats(Product $product): array
    {
        $reviews = $product->avis()->approved()->get('note');

        $distribution = array_fill(1, 5, 0);
        foreach ($reviews as $r) {
            $distribution[$r->note]++;
        }

        return [
            'average'      => $reviews->avg('note') ?? 0,
            'count'        => $reviews->count(),
            'distribution' => $distribution,
        ];
    }
}
