<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Command extends Model
{
    use HasFactory;

    public $timestamps = true;

    public const UPDATED_AT = null;

    public const STATUS_PENDING = 'pending';

    protected $fillable = [
        'total',
        'statut',
        'adresse_livraison',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lignes(): HasMany
    {
        return $this->hasMany(CommandLigne::class, 'command_id');
    }
}
