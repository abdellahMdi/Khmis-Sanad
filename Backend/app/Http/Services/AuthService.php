<?php

namespace App\Http\Services;

use App\Models\Panier;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class AuthService
{
    /**
     * Register a new client user and auto-create their cart.
     *
     * @param  array{firstname:string, lastname:string, email:string,
     *               mot_de_passe:string, telephone:?string} $data
     * @return array{user: User, token: string}
     */
    public function register(array $data): array
    {
        $clientRole = Role::where('label', 'client')->firstOrFail();

        /** @var User $user */
        $user = User::create([
            'firstname'    => $data['firstname'],
            'lastname'     => $data['lastname'],
            'email'        => $data['email'],
            'mot_de_passe' => $data['mot_de_passe'],  // cast: hashed
            'telephone'    => $data['telephone'] ?? null,
            'role_id'      => $clientRole->id,
        ]);

        // Every new client gets an empty cart immediately
        Panier::create(['user_id' => $user->id]);

        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user->load('role'), 'token' => $token];
    }

    /**
     * Validate credentials and return a Sanctum token.
     *
     * @param  array{email:string, mot_de_passe:string} $data
     * @return array{user: User, token: string}
     * @throws AuthenticationException
     */
    public function login(array $data): array
    {
        $user = User::where('email', $data['email'])->firstOrFail();

        if (!Hash::check($data['mot_de_passe'], $user->mot_de_passe)) {
            throw new AuthenticationException('Invalid credentials.');
        }

        // Revoke all old tokens for a single-session experience (optional)
        // $user->tokens()->delete();

        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user->load('role', 'cooperative'), 'token' => $token];
    }

    /**
     * Revoke the current access token.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    /**
     * Return the authenticated user with role + cooperative eager-loaded.
     */
    public function profile(User $user): User
    {
        return $user->load('role', 'cooperative');
    }
}
