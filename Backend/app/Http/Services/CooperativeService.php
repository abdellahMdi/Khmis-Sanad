<?php

namespace App\Http\Services;

use App\Models\Cooperative;
use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CooperativeService
{
    /**
     * Return paginated list of approved cooperatives.
     */
    public function listApproved(int $perPage = 20): LengthAwarePaginator
    {
        return Cooperative::approved()
            ->with('user:id,firstname,lastname,telephone')
            ->paginate($perPage);
    }

    /**
     * Return a cooperative with its full product catalogue.
     */
    public function detail(Cooperative $cooperative): Cooperative
    {
        return $cooperative->load([
            'user:id,firstname,lastname,telephone',
            'products.images',
            'products.category',
        ]);
    }

    /**
     * Register the current user as a new cooperative artisan.
     * Upgrades the user role to 'artisan' automatically.
     *
     * @param  User  $user
     * @param  array{name:string, bio:?string, hq_location:?string} $data
     */
    public function register(User $user, array $data): Cooperative
    {
        abort_if($user->cooperative()->exists(), 409, 'Already registered as a cooperative.');

        $artisanRole = Role::where('label', 'artisan')->firstOrFail();
        $user->update(['role_id' => $artisanRole->id]);

        return $user->cooperative()->create([
            'name'        => $data['name'],
            'bio'         => $data['bio'] ?? null,
            'hq_location' => $data['hq_location'] ?? null,
            // slug auto-generated in Cooperative::boot()
        ]);
    }

    /**
     * Update the cooperative's public profile.
     */
    public function updateProfile(Cooperative $cooperative, array $data): Cooperative
    {
        $cooperative->update(array_filter([
            'name'        => $data['name'] ?? null,
            'bio'         => $data['bio'] ?? null,
            'hq_location' => $data['hq_location'] ?? null,
        ], fn ($v) => $v !== null));

        return $cooperative->fresh();
    }

    /**
     * Set the administrative status of a cooperative (admin action).
     *
     * @param  string $status  pending | approved | blocked
     */
    public function setStatus(Cooperative $cooperative, string $status): Cooperative
    {
        $cooperative->update(['status' => $status]);

        // TODO: dispatch CooperativeStatusChanged event to notify the artisan

        return $cooperative->fresh(['user']);
    }
}
