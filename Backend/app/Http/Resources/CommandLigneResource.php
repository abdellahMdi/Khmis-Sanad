<?php

namespace App\Http\Resources;

use App\Models\CommandLigne;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin CommandLigne */
class CommandLigneResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'prix_unitaire' => $this->prix_unitaire,
            'subtotal' => $this->prix_unitaire !== null
                ? round(((float) $this->prix_unitaire) * $this->quantity, 2)
                : null,
            'product' => $this->whenLoaded('product', fn () => new ProductResource($this->product)),
        ];
    }
}
