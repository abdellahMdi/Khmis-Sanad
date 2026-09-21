<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Cooperative;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $roleLabel = $request->input('role', 'client');
        $role = Role::query()->where('label', $roleLabel)->firstOrFail();

        $user = User::query()->create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'mot_de_passe' => $request->password,
            'telephone' => $request->telephone,
            'role_id' => $role->id,
        ]);

        if ($roleLabel === 'artisan') {
            $name = $request->string('shop_name')->toString();
            Cooperative::query()->create([
                'name' => $name,
                'slug' => $this->uniqueCoopSlug($name),
                'bio' => $request->input('bio'),
                'hq_location' => $request->input('terroir', $request->input('hq_location')),
                'status' => Cooperative::STATUS_PENDING,
                'user_id' => $user->id,
            ]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return (new UserResource($user->load('role', 'cooperative')))
            ->response()
            ->setStatusCode(201);
    }

    public function login(LoginRequest $request): UserResource
    {
        if (! Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants invalides.'],
            ]);
        }

        $request->session()->regenerate();

        return new UserResource($request->user()->load('role', 'cooperative'));
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->flush();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out.']);
    }

    public function user(Request $request): JsonResponse
    {
        return (new UserResource($request->user()->load('role', 'cooperative')))
            ->response()
            ->setStatusCode(200);
    }

    private function uniqueCoopSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'boutique';
        $slug = $base;
        $i = 1;

        while (Cooperative::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
