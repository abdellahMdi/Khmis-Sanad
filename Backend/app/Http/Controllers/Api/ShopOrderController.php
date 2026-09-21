<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommandResource;
use App\Models\Command;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ShopOrderController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $coop = $request->user()->cooperative;

        if (! $coop) {
            abort(404, 'Shop not found.');
        }

        $commands = Command::query()
            ->with(['lignes.product.cooperative.user', 'lignes.product.images', 'lignes.product.category'])
            ->whereHas('lignes.product', fn ($q) => $q->where('coop_id', $coop->id))
            ->latest('created_at')
            ->paginate(15);

        return CommandResource::collection($commands);
    }
}
