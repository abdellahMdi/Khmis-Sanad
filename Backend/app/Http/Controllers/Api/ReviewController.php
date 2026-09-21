<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Resources\AvisResource;
use App\Models\Avis;
use App\Models\CommandLigne;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request): JsonResponse
    {
        $this->authorize('create', Avis::class);

        $purchased = CommandLigne::query()
            ->where('product_id', $request->integer('product_id'))
            ->whereHas('command', fn ($q) => $q->where('user_id', $request->user()->id))
            ->exists();

        if (! $purchased) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => ['product_id' => ['Vous devez avoir commandé ce produit pour laisser un avis.']],
            ], 422);
        }

        $alreadyReviewed = Avis::query()
            ->where('product_id', $request->integer('product_id'))
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($alreadyReviewed) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => ['product_id' => ['Vous avez déjà laissé un avis pour ce produit.']],
            ], 422);
        }

        $avis = Avis::query()->create([
            'note' => $request->note,
            'comment' => $request->comment,
            'status' => Avis::STATUS_PENDING,
            'user_id' => $request->user()->id,
            'product_id' => $request->integer('product_id'),
        ]);

        return (new AvisResource($avis->load('user')))
            ->response()
            ->setStatusCode(201);
    }
}
