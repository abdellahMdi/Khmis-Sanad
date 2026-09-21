<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public $timestamps = true;

    public const UPDATED_AT = null;

    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'mot_de_passe',
        'telephone',
        'role_id',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'mot_de_passe' => 'hashed',
        ];
    }

    public function getAuthPassword(): string
    {
        return $this->mot_de_passe;
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function cooperative(): HasOne
    {
        return $this->hasOne(Cooperative::class);
    }

    public function panier(): HasOne
    {
        return $this->hasOne(Panier::class);
    }

    public function commands(): HasMany
    {
        return $this->hasMany(Command::class);
    }

    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class);
    }

    public function notifications(): MorphMany
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')
            ->orderByDesc('created_at');
    }

    public function hasRole(string ...$roles): bool
    {
        $label = $this->role?->label;

        return $label !== null && in_array($label, $roles, true);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isArtisan(): bool
    {
        return $this->hasRole('artisan');
    }

    public function isClient(): bool
    {
        return $this->hasRole('client');
    }
}
