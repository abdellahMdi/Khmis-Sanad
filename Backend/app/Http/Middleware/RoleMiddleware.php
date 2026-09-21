<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();
        $roles = array_filter(explode('|', $role));

        if (! $user || ! $user->hasRole(...$roles)) {
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        return $next($request);
    }
}
