<?php

namespace App\Http\Resources;

use App\Models\Command;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Command */
class CommandResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $whatsapp = null;
        if ($this->relationLoaded('lignes')) {
            $coop = $this->lignes->first()?->product?->cooperative;
            $whatsapp = $coop?->whatsappNumber();
        }

        return [
            'id' => $this->id,
            'total' => $this->total,
            'statut' => $this->statut,
            'adresse_livraison' => $this->adresse_livraison,
            'created_at' => $this->created_at,
            'whatsapp_number' => $whatsapp,
            'whatsapp_link_contract' => 'Frontend builds https://wa.me/{whatsapp_number}?text=...',
            'lignes' => CommandLigneResource::collection($this->whenLoaded('lignes')),
        ];
    }
}
