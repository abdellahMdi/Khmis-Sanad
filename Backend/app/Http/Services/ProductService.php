<?php

namespace App\Http\Services;

use App\Models\Cooperative;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class ProductService
{
    /**
     * Return a paginated, filtered list of in-stock products.
     *
     * Supported query params:
     *   - category_id  : int
     *   - coop_id      : int
     *   - search       : string  (searches product name)
     *   - min_price    : float
     *   - max_price    : float
     *   - per_page     : int     (default 16)
     */
    public function list(Request $request): LengthAwarePaginator
    {
        $query = Product::with(['cooperative', 'category', 'images'])
            ->inStock();

        if ($request->filled('category_id')) {
            $query->where('cat_id', $request->category_id);
        }

        if ($request->filled('coop_id')) {
            $query->where('coop_id', $request->coop_id);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('min_price')) {
            $query->where('prix', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('prix', '<=', $request->max_price);
        }

        return $query->latest()->paginate($request->input('per_page', 16));
    }

    /**
     * Return a single product with full relational data:
     * cooperative + owner user, category, ordered images, approved reviews.
     */
    public function detail(Product $product): Product
    {
        return $product->load([
            'cooperative.user',
            'category',
            'images',
            'avis' => fn ($q) => $q->approved()->with('user:id,firstname,lastname'),
        ]);
    }

    /**
     * Build the WhatsApp deep-link for contacting the artisan directly.
     * Returns null when the cooperative owner has no phone number.
     */
    public function whatsappLink(Product $product, string $message = ''): ?string
    {
        $phone = $product->cooperative?->user?->telephone;

        if (!$phone) {
            return null;
        }

        // Strip non-numeric characters and prepend country code if needed
        $clean = preg_replace('/\D/', '', $phone);

        $encoded = $message ? '?text=' . urlencode($message) : '';

        return "https://wa.me/{$clean}{$encoded}";
    }

    /**
     * Create a product for the given cooperative (must be approved).
     *
     * @param  array $data  Validated input from ProductController
     */
    public function create(Cooperative $cooperative, array $data): Product
    {
        abort_if($cooperative->status !== 'approved', 403, 'Cooperative not approved.');

        /** @var Product $product */
        $product = $cooperative->products()->create([
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
            'prix'        => $data['prix'],
            'prix_remise' => $data['prix_remise'] ?? null,
            'stock'       => $data['stock'],
            'cat_id'      => $data['cat_id'],
        ]);

        $this->syncImages($product, $data['images'] ?? []);

        return $product->load('images', 'category');
    }

    /**
     * Update a product's fields (partial update supported).
     */
    public function update(Product $product, array $data): Product
    {
        $product->update(array_filter($data, fn ($v) => $v !== null));

        if (isset($data['images'])) {
            $this->syncImages($product, $data['images']);
        }

        return $product->fresh(['images', 'category']);
    }

    /**
     * Delete a product.
     */
    public function delete(Product $product): void
    {
        $product->delete();
    }

    /**
     * Replace all images for a product.
     */
    private function syncImages(Product $product, array $images): void
    {
        if (empty($images)) {
            return;
        }

        $product->images()->delete();

        foreach ($images as $img) {
            $product->images()->create([
                'url'   => $img['url'],
                'order' => $img['order'] ?? 0,
            ]);
        }
    }
}
