<?php

namespace App\Http\Resources;

use App\Models\Avis;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Product */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'prix' => $this->prix,
            'prix_remise' => $this->prix_remise,
            'price' => $this->effectivePrice(),
            'stock' => $this->stock,
            'category' => $this->whenLoaded('category', fn () => new CategoryResource($this->category)),
            'shop' => $this->whenLoaded('cooperative', fn () => new ShopResource($this->cooperative)),
            'whatsapp_number' => $this->whenLoaded('cooperative', fn () => $this->cooperative->whatsappNumber()),
            'producer_story' => $this->whenLoaded('cooperative', fn () => $this->cooperative->bio),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'reviews' => $this->when(
                $this->relationLoaded('avis'),
                fn () => AvisResource::collection(
                    $this->avis->where('status', Avis::STATUS_APPROVED)->values()
                )
            ),
        ];
    }
}
