<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'email' => $this->email,
            'telephone' => $this->telephone,
            'role' => $this->role?->label,
            'shop' => $this->whenLoaded('cooperative', fn () => new ShopResource($this->cooperative)),
            'created_at' => $this->created_at,
        ];
    }
}
