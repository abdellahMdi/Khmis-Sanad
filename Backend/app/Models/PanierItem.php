<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PanierItem extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'quantite',
        'panier_id',
        'product_id',
    ];

    protected function casts(): array
    {
        return [
            'quantite' => 'integer',
        ];
    }

    public function panier(): BelongsTo
    {
        return $this->belongsTo(Panier::class, 'panier_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
