<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureArtisanNotBlocked
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user?->isArtisan() && $user->cooperative?->isBlocked()) {
            return response()->json([
                'message' => 'This shop has been blocked.',
            ], 403);
        }

        return $next($request);
    }
}
