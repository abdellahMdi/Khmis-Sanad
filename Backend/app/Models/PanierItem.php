<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PanierItem extends Model
{
    protected $fillable = [
        'quantite',
        'panier_id',
        'product_id',
    ];

    protected $casts = [
        'quantite' => 'integer',
    ];

    public function panier(): BelongsTo
    {
        return $this->belongsTo(Panier::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}