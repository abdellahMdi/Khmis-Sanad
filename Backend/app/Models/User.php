<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

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
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'mot_de_passe' => 'hashed',
        ];
    }

    public function getAuthPassword()
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
}