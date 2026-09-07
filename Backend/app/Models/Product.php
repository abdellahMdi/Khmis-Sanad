<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'prix',
        'prix_remise',
        'stock',
        'coop_id',
        'cat_id',
    ];

    protected $casts = [
        'prix' => 'decimal:2',
        'prix_remise' => 'decimal:2',
        'stock' => 'integer',
    ];

    public function cooperative(): BelongsTo
    {
        return $this->belongsTo(Cooperative::class, 'coop_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'cat_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImg::class, 'product_id');
    }

    public function panierItems(): HasMany
    {
        return $this->hasMany(PanierItem::class);
    }

    public function commandLignes(): HasMany
    {
        return $this->hasMany(CommandLigne::class);
    }

    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class);
    }
}