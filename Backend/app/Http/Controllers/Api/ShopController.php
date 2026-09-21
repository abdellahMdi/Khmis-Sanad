<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\UpdateShopRequest;
use App\Http\Requests\Shop\UploadShopProofRequest;
use App\Http\Resources\ShopResource;
use App\Models\Cooperative;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ShopController extends Controller
{
    public function show(Request $request): ShopResource
    {
        $coop = $request->user()->cooperative;

        if (! $coop) {
            abort(404, 'Shop not found.');
        }

        return new ShopResource($coop->load('user'));
    }

    public function update(UpdateShopRequest $request): ShopResource
    {
        $coop = $request->user()->cooperative;

        if (! $coop) {
            abort(404, 'Shop not found.');
        }

        $this->authorize('update', $coop);

        $data = [];

        if ($request->filled('name')) {
            $data['name'] = $request->name;
            $data['slug'] = $this->uniqueSlug($request->name, $coop->id);
        }

        if ($request->exists('bio')) {
            $data['bio'] = $request->bio;
        }

        if ($request->exists('terroir') || $request->exists('hq_location')) {
            $data['hq_location'] = $request->input('terroir', $request->input('hq_location'));
        }

        $coop->update($data);

        return new ShopResource($coop->fresh()->load('user'));
    }

    public function uploadProof(UploadShopProofRequest $request): ShopResource
    {
        $coop = $request->user()->cooperative;

        if (! $coop) {
            abort(404, 'Shop not found.');
        }

        $this->authorize('uploadProof', $coop);

        $oldPath = $coop->proof_path;
        $path = $request->file('proof')->store('proofs/'.$coop->id, 'public');

        if (! $path) {
            abort(500, 'Le justificatif n’a pas pu être enregistré.');
        }

        $coop->update(['proof_path' => $path]);

        if ($oldPath && $oldPath !== $path) {
            Storage::disk('public')->delete($oldPath);
        }

        return new ShopResource($coop->fresh()->load('user'));
    }

    private function uniqueSlug(string $name, int $ignoreId): string
    {
        $base = Str::slug($name) ?: 'boutique';
        $slug = $base;
        $i = 1;

        while (Cooperative::query()->where('slug', $slug)->where('id', '!=', $ignoreId)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
