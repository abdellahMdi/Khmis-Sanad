<?php

namespace App\Http\Resources;

use App\Models\Cooperative;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Cooperative */
class ShopResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $this->resource->loadMissing('user');

        $canSeeProof = $request->user()
            && ($request->user()->isAdmin() || $request->user()->id === $this->user_id);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'bio' => $this->bio,
            'terroir' => $this->hq_location,
            'hq_location' => $this->hq_location,
            'status' => $this->status,
            'has_proof' => $this->hasProof(),
            'proof_url' => $this->when($canSeeProof, $this->proofUrl()),
            'whatsapp_number' => $this->whatsappNumber(),
            'owner_email' => $this->when(
                $request->user()?->isAdmin(),
                fn () => $this->user?->email
            ),
            'artisan' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'firstname' => $this->user->firstname,
                'lastname' => $this->user->lastname,
            ]),
        ];
    }
}
