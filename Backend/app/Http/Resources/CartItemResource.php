<?php

namespace App\Http\Resources;

use App\Models\PanierItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PanierItem */
class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $unit = $this->product ? $this->product->effectivePrice() : null;

        return [
            'id' => $this->id,
            'quantite' => $this->quantite,
            'product' => $this->whenLoaded('product', fn () => new ProductResource($this->product)),
            'unit_price' => $unit,
            'subtotal' => $unit !== null ? round(((float) $unit) * $this->quantite, 2) : null,
        ];
    }
}
