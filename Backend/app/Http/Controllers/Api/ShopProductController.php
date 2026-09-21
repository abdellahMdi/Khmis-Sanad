<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\StoreShopProductRequest;
use App\Http\Requests\Shop\UpdateShopProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class ShopProductController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $coop = $request->user()->cooperative;

        if (! $coop) {
            abort(404, 'Shop not found.');
        }

        $this->authorize('viewAny', Product::class);

        $products = Product::query()
            ->with(['category', 'cooperative.user', 'images'])
            ->where('coop_id', $coop->id)
            ->orderBy('name')
            ->paginate(15);

        return ProductResource::collection($products);
    }

    public function show(Product $product): ProductResource
    {
        $this->authorize('view', $product);

        return new ProductResource(
            $product->load(['category', 'cooperative.user', 'images'])
        );
    }

    public function store(StoreShopProductRequest $request): JsonResponse
    {
        $this->authorize('create', Product::class);

        $coop = $request->user()->cooperative;
        $product = Product::query()->create([
            'name' => $request->name,
            'slug' => Product::uniqueSlug($request->name),
            'description' => $request->description,
            'prix' => $request->prix,
            'prix_remise' => $request->prix_remise,
            'stock' => $request->stock,
            'coop_id' => $coop->id,
            'cat_id' => $request->cat_id,
        ]);

        $this->syncImages($product, $request->input('images', []));

        return (new ProductResource($product->load(['category', 'cooperative.user', 'images'])))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateShopProductRequest $request, Product $product): ProductResource
    {
        $this->authorize('update', $product);

        $data = $request->safe()->except(['images']);

        if ($request->filled('name')) {
            $data['slug'] = Product::uniqueSlug($request->name, $product->id);
        }

        $price = (float) ($data['prix'] ?? $product->prix);
        $discount = array_key_exists('prix_remise', $data)
            ? $data['prix_remise']
            : $product->prix_remise;

        if ($discount !== null && (float) $discount >= $price) {
            throw ValidationException::withMessages([
                'prix_remise' => ['Le prix remisé doit être inférieur au prix normal.'],
            ]);
        }

        $product->update($data);

        if ($request->exists('images')) {
            $this->syncImages($product, $request->input('images', []));
        }

        return new ProductResource($product->fresh()->load(['category', 'cooperative.user', 'images']));
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->authorize('delete', $product);
        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }

    private function syncImages(Product $product, array $urls): void
    {
        $product->images()->delete();

        foreach (array_values($urls) as $index => $url) {
            $product->images()->create([
                'url' => $url,
                'order' => $index + 1,
            ]);
        }
    }
}
