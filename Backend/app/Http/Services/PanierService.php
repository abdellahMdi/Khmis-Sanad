<?php

namespace App\Http\Services;

use App\Models\Panier;
use App\Models\PanierItem;
use App\Models\Product;
use App\Models\User;

class PanierService
{
    /**
     * Return (or create) the user's cart with items eager-loaded.
     */
    public function getOrCreate(User $user): Panier
    {
        return $user->panier()->with(['items.product.images'])->firstOrCreate(
            ['user_id' => $user->id]
        );
    }

    /**
     * Add a product to the cart or update its quantity.
     * Validates that requested quantity does not exceed stock.
     *
     * @param  User  $user
     * @param  int   $productId
     * @param  int   $quantite
     * @return Panier  (refreshed with items)
     */
    public function addItem(User $user, int $productId, int $quantite): Panier
    {
        $product = Product::findOrFail($productId);

        abort_if(
            $product->stock < $quantite,
            422,
            "Insufficient stock for \'{$product->name}\'. Available: {$product->stock}."
        );

        $panier = $user->panier()->firstOrCreate(['user_id' => $user->id]);

        $panier->items()->updateOrCreate(
            ['product_id' => $productId],
            ['quantite'   => $quantite]
        );

        return $panier->load(['items.product.images'])->append('total');
    }

    /**
     * Remove a single item from the cart.
     * Ensures the item belongs to the authenticated user.
     */
    public function removeItem(User $user, PanierItem $item): void
    {
        abort_if($item->panier->user_id !== $user->id, 403, 'Forbidden.');
        $item->delete();
    }

    /**
     * Remove all items from the user's cart.
     */
    public function clear(User $user): void
    {
        $user->panier?->items()->delete();
    }
}
