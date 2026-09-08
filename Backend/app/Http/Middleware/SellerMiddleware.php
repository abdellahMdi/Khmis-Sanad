<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SellerMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // User must be authenticated
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // User must have the seller/cooperative role
        if (!$user->isSeller()) {
            return response()->json([
                'message' => 'Access denied. Cooperative seller privileges are required.'
            ], 403);
        }

        return $next($request);
    }
}