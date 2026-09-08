<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
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

        // User must have the admin role
        if (!$user->isAdmin()) {
            return response()->json([
                'message' => 'Access denied. Administrator privileges are required.'
            ], 403);
        }

        return $next($request);
    }
}