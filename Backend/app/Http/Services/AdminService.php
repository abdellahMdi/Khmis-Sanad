<?php

namespace App\Http\Services;

use App\Models\Avis;
use App\Models\Command;
use App\Models\Cooperative;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminService
{
    /**
     * Paginated list of all users with their role.
     */
    public function listUsers(int $perPage = 30): LengthAwarePaginator
    {
        return User::with('role')
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Paginated list of all cooperatives — pending first.
     */
    public function listCooperatives(int $perPage = 20): LengthAwarePaginator
    {
        return Cooperative::with('user')
            ->orderByRaw("status = 'pending' DESC")
            ->paginate($perPage);
    }

    /**
     * Paginated list of all orders (admin view includes user info).
     */
    public function listCommands(int $perPage = 20): LengthAwarePaginator
    {
        return Command::with(['user:id,firstname,lastname,email', 'lignes'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Paginated list of all pending reviews awaiting moderation.
     */
    public function pendingReviews(int $perPage = 20): LengthAwarePaginator
    {
        return Avis::where('status', 'pending')
            ->with(['user:id,firstname,lastname', 'product:id,name'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Global platform stats (dashboard overview).
     *
     * @return array{users:int, cooperatives:int, products:int,
     *               pending_orders:int, pending_reviews:int}
     */
    public function stats(): array
    {
        return [
            'total_users'        => User::count(),
            'total_cooperatives' => Cooperative::count(),
            'approved_coops'     => Cooperative::approved()->count(),
            'pending_coops'      => Cooperative::pending()->count(),
            'pending_orders'     => Command::where('statut', 'pending')->count(),
            'pending_reviews'    => Avis::where('status', 'pending')->count(),
        ];
    }
}
