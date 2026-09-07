<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'firstname'    => ['required', 'string', 'max:50'],
            'lastname'     => ['required', 'string', 'max:50'],
            'email'        => ['required', 'string', 'email', 'max:150', 'unique:users,email'],
            'mot_de_passe' => ['required', 'string', 'min:8'],
            'telephone'    => ['required', 'string', 'max:50'],
            'role_id'      => ['required', 'integer', 'exists:roles,id'],
        ]);

        $result = $this->authService->register($validated);

        return response()->json([
            'message' => 'User registered successfully.',
            'user'    => $result['user'],
            'token'   => $result['token'],
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'        => ['required', 'string', 'email'],
            'mot_de_passe' => ['required', 'string'],
        ]);

        $result = $this->authService->login($validated);

        return response()->json([
            'message' => 'Logged in successfully.',
            'user'    => $result['user'],
            'token'   => $result['token'],
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            $this->authService->logout($user);
        }

        return response()->json([
            'message' => 'Logged out successfully.',
        ], 200);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->load('role'),
        ], 200);
    }
}