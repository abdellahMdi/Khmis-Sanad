<?php

namespace App\Http\Services;

use App\Models\Command;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CommandService
{
    /**
     * Return paginated orders for the given user.
     */
    public function listForUser(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return Command::forUser($user->id)
            ->with(['lignes.product.images'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Return a single order (ownership checked in controller).
     */
    public function detail(Command $command): Command
    {
        return $command->load([
            'lignes.product.images',
            'lignes.product.cooperative.user',
            'user:id,firstname,lastname,email',
        ]);
    }

    /**
     * Checkout: atomically convert the user's cart into a confirmed order.
     *
     * Steps:
     *   1. Validate cart is not empty.
     *   2. For each cart item: check stock, snapshot the unit price.
     *   3. Create the Command record.
     *   4. Bulk-insert CommandLigne rows.
     *   5. Decrement stock on each product.
     *   6. Empty the cart.
     *
     * @param  User   $user
     * @param  string $adresseLivraison
     * @return Command
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException  (422 if cart empty / out of stock)
     */
    public function checkout(User $user, string $adresseLivraison): Command
    {
        $panier = $user->panier()->with('items.product')->first();

        abort_if(!$panier || $panier->items->isEmpty(), 422, 'Cart is empty.');

        return DB::transaction(function () use ($user, $panier, $adresseLivraison) {
            $total  = 0;
            $lignes = [];

            foreach ($panier->items as $item) {
                $product = $item->product;

                abort_if(
                    $product->stock < $item->quantite,
                    422,
                    "Insufficient stock for \'{$product->name}\'. Available: {$product->stock}."
                );

                $unitPrice = $product->prix_remise ?? $product->prix;
                $total    += $unitPrice * $item->quantite;

                $lignes[] = [
                    'product_id'    => $product->id,
                    'quantity'      => $item->quantite,
                    'prix_unitaire' => $unitPrice,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];

                $product->decrement('stock', $item->quantite);
            }

            /** @var Command $command */
            $command = Command::create([
                'user_id'           => $user->id,
                'total'             => $total,
                'statut'            => 'pending',
                'adresse_livraison' => $adresseLivraison,
            ]);

            $command->lignes()->insert(
                array_map(fn ($l) => [...$l, 'command_id' => $command->id], $lignes)
            );

            // Clear the cart
            $panier->items()->delete();

            return $command->load('lignes.product');
        });
    }

    /**
     * Update the status of an order (admin action).
     *
     * @param  string $statut  One of Command::STATUSES
     */
    public function updateStatus(Command $command, string $statut): Command
    {
        abort_if(
            !in_array($statut, Command::STATUSES, true),
            422,
            'Invalid status.'
        );

        $command->update(['statut' => $statut]);

        // TODO: dispatch OrderStatusUpdated event to notify the client

        return $command->fresh();
    }

    /**
     * Cancel an order (client-initiated, only when still pending).
     */
    public function cancel(Command $command): Command
    {
        abort_if($command->statut !== 'pending', 422, 'Cannot cancel a non-pending order.');

        // Restore stock for each line
        DB::transaction(function () use ($command) {
            foreach ($command->lignes as $ligne) {
                $ligne->product->increment('stock', $ligne->quantity);
            }
            $command->update(['statut' => 'cancelled']);
        });

        return $command->fresh();
    }
}
