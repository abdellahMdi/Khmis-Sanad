<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AvisResource;
use App\Models\Avis;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewController extends Controller
{
    public function pending(): AnonymousResourceCollection
    {
        return AvisResource::collection(
            Avis::query()
                ->with(['user', 'product'])
                ->where('status', Avis::STATUS_PENDING)
                ->orderBy('id')
                ->paginate(15)
        );
    }

    public function approve(Avis $review): AvisResource
    {
        $review->update(['status' => Avis::STATUS_APPROVED]);

        return new AvisResource($review->fresh()->load('user'));
    }

    public function destroy(Avis $review): JsonResponse
    {
        $review->delete();

        return response()->json(['message' => 'Review deleted.']);
    }
}
