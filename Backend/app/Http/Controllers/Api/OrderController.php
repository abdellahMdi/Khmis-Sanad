<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Resources\CommandResource;
use App\Models\Command;
use App\Models\Cooperative;
use App\Models\Panier;
use App\Notifications\NewOrderNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $commands = Command::query()
            ->with(['lignes.product.cooperative.user', 'lignes.product.images', 'lignes.product.category'])
            ->where('user_id', $request->user()->id)
            ->latest('created_at')
            ->paginate(15);

        return CommandResource::collection($commands);
    }

    public function show(Request $request, Command $command): CommandResource
    {
        if ($command->user_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            abort(403, 'This action is unauthorized.');
        }

        $command->load(['lignes.product.cooperative.user', 'lignes.product.images', 'lignes.product.category']);

        return new CommandResource($command);
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $panier = Panier::query()
            ->with(['items.product.cooperative.user'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $panier || $panier->items->isEmpty()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => ['cart' => ['Le panier est vide.']],
            ], 422);
        }

        $commands = DB::transaction(function () use ($request, $panier) {
            $created = collect();
            $groups = $panier->items->groupBy(fn ($item) => $item->product->coop_id);

            foreach ($groups as $items) {
                foreach ($items as $item) {
                    $product = $item->product()->lockForUpdate()->first();

                    if ($product->cooperative->status !== Cooperative::STATUS_APPROVED) {
                        abort(422, 'Un produit du panier n’est plus disponible.');
                    }

                    if ($item->quantite > $product->stock) {
                        abort(422, 'Stock insuffisant pour '.$product->name.'.');
                    }
                }

                $total = $items->sum(fn ($item) => ((float) $item->product->effectivePrice()) * $item->quantite);

                $command = Command::query()->create([
                    'total' => round($total, 2),
                    'statut' => Command::STATUS_PENDING,
                    'adresse_livraison' => $request->adresse_livraison,
                    'user_id' => $request->user()->id,
                ]);

                foreach ($items as $item) {
                    $product = $item->product()->lockForUpdate()->first();
                    $unit = $product->effectivePrice();

                    $command->lignes()->create([
                        'quantity' => $item->quantite,
                        'prix_unitaire' => $unit,
                        'product_id' => $product->id,
                    ]);

                    $product->update(['stock' => $product->stock - $item->quantite]);
                }

                $artisan = $items->first()->product->cooperative->user;
                $artisan->notify(new NewOrderNotification($command->fresh('lignes.product')));
                $created->push($command->load(['lignes.product.cooperative.user', 'lignes.product.images', 'lignes.product.category']));
            }

            $panier->items()->delete();

            return $created;
        });

        return CommandResource::collection($commands)
            ->response()
            ->setStatusCode(201);
    }
}
