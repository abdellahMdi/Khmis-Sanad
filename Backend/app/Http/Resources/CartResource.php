<?php

namespace App\Http\Resources;

use App\Models\Panier;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Panier */
class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items') ? $this->items : collect();

        $total = $items->sum(function ($item) {
            if (! $item->product) {
                return 0;
            }

            return ((float) $item->product->effectivePrice()) * $item->quantite;
        });

        return [
            'id' => $this->id,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'total' => round($total, 2),
        ];
    }
}
