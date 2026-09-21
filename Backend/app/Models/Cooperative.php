<?php

namespace App\Models;

use App\Support\WhatsApp;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cooperative extends Model
{
    use HasFactory;

    public $timestamps = false;

    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_BLOCKED = 'blocked';

    protected $fillable = [
        'name',
        'slug',
        'bio',
        'hq_location',
        'status',
        'proof_path',
        'user_id',
    ];

    public function hasProof(): bool
    {
        return filled($this->proof_path);
    }

    public function proofUrl(): ?string
    {
        if (! $this->proof_path) {
            return null;
        }

        return asset('storage/'.$this->proof_path);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'coop_id');
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isBlocked(): bool
    {
        return $this->status === self::STATUS_BLOCKED;
    }

    public function whatsappNumber(): ?string
    {
        return WhatsApp::number($this->user?->telephone);
    }
}
