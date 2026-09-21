<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\StoreCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartItemResource;
use App\Http\Resources\CartResource;
use App\Models\Cooperative;
use App\Models\Panier;
use App\Models\PanierItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): CartResource
    {
        return new CartResource($this->panier($request)->load('items.product.category', 'items.product.images', 'items.product.cooperative.user'));
    }

    public function storeItem(StoreCartItemRequest $request): JsonResponse
    {
        $product = Product::query()
            ->whereKey($request->integer('product_id'))
            ->whereHas('cooperative', fn ($q) => $q->where('status', Cooperative::STATUS_APPROVED))
            ->firstOrFail();

        if ($request->integer('quantite') > $product->stock) {
            abort(422, 'Stock insuffisant.');
        }

        $panier = $this->panier($request);

        $item = PanierItem::query()->firstOrNew([
            'panier_id' => $panier->id,
            'product_id' => $product->id,
        ]);

        $item->quantite = ($item->exists ? $item->quantite : 0) + $request->integer('quantite');

        if ($item->quantite > $product->stock) {
            abort(422, 'Stock insuffisant.');
        }

        $item->save();

        return (new CartItemResource($item->load('product.category', 'product.images', 'product.cooperative.user')))
            ->response()
            ->setStatusCode(201);
    }

    public function updateItem(UpdateCartItemRequest $request, PanierItem $item): CartItemResource
    {
        $this->assertOwnership($request, $item);
        $item->load('product');

        if ($request->integer('quantite') > $item->product->stock) {
            abort(422, 'Stock insuffisant.');
        }

        $item->update(['quantite' => $request->integer('quantite')]);

        return new CartItemResource($item->load('product.category', 'product.images', 'product.cooperative.user'));
    }

    public function destroyItem(Request $request, PanierItem $item): JsonResponse
    {
        $this->assertOwnership($request, $item);
        $item->delete();

        return response()->json(['message' => 'Item removed.']);
    }

    private function panier(Request $request): Panier
    {
        return Panier::query()->firstOrCreate(['user_id' => $request->user()->id]);
    }

    private function assertOwnership(Request $request, PanierItem $item): void
    {
        $panier = $this->panier($request);

        if ($item->panier_id !== $panier->id) {
            abort(403, 'This action is unauthorized.');
        }
    }
}
