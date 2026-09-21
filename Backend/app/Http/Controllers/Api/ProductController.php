<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Avis;
use App\Models\CommandLigne;
use App\Models\Cooperative;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Product::query()
            ->with(['category', 'cooperative.user', 'images'])
            ->whereHas('cooperative', fn ($q) => $q->where('status', Cooperative::STATUS_APPROVED));

        if ($request->filled('category')) {
            $category = $request->string('category')->toString();
            $query->where(function ($q) use ($category) {
                if (ctype_digit($category)) {
                    $q->where('cat_id', (int) $category);
                } else {
                    $q->whereHas('category', fn ($c) => $c->where('name', $category));
                }
            });
        }

        if ($request->filled('min_price')) {
            $query->where('prix', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('prix', '<=', $request->input('max_price'));
        }

        if ($request->filled('q')) {
            $term = '%'.$request->string('q')->toString().'%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)->orWhere('description', 'like', $term);
            });
        }

        return ProductResource::collection(
            $query->orderBy('name')->paginate((int) $request->integer('per_page', 12))
        );
    }

    public function show(Request $request, string $slug): ProductResource
    {
        $product = Product::query()
            ->with([
                'category',
                'cooperative.user',
                'images',
                'avis' => fn ($q) => $q
                    ->where('status', Avis::STATUS_APPROVED)
                    ->with('user'),
            ])
            ->where(function ($query) use ($slug) {
                $query
                    ->where('slug', $slug)
                    ->orWhere('id', ctype_digit($slug) ? (int) $slug : -1);
            })
            ->whereHas('cooperative', fn ($q) => $q->where('status', Cooperative::STATUS_APPROVED))
            ->firstOrFail();

        return (new ProductResource($product))->additional([
            'meta' => ['viewer' => $this->viewerReviewState($request, $product)],
        ]);
    }

    /**
     * Tells the SPA whether the current visitor may review this product.
     *
     * @return array<string, bool>
     */
    private function viewerReviewState(Request $request, Product $product): array
    {
        $user = $request->user() ?? $request->user('web');

        if (! $user || ! $user->isClient()) {
            return [
                'has_purchased' => false,
                'has_reviewed' => false,
                'can_review' => false,
            ];
        }

        $hasPurchased = CommandLigne::query()
            ->where('product_id', $product->id)
            ->whereHas('command', fn ($q) => $q->where('user_id', $user->id))
            ->exists();

        $hasReviewed = Avis::query()
            ->where('product_id', $product->id)
            ->where('user_id', $user->id)
            ->exists();

        return [
            'has_purchased' => $hasPurchased,
            'has_reviewed' => $hasReviewed,
            'can_review' => $hasPurchased && ! $hasReviewed,
        ];
    }
}
