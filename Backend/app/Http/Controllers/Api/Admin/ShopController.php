<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShopResource;
use App\Models\Cooperative;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ShopController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ShopResource::collection(
            Cooperative::query()->with('user')->orderBy('id')->paginate(20)
        );
    }

    public function approve(Cooperative $shop): ShopResource
    {
        if (! $shop->hasProof()) {
            abort(422, 'Impossible d’approuver sans justificatif de la coopérative.');
        }

        $shop->update(['status' => Cooperative::STATUS_APPROVED]);

        return new ShopResource($shop->fresh()->load('user'));
    }

    public function block(Cooperative $shop): ShopResource
    {
        $shop->update(['status' => Cooperative::STATUS_BLOCKED]);

        return new ShopResource($shop->fresh()->load('user'));
    }
}
