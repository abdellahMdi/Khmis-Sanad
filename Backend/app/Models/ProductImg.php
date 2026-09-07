<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImg extends Model
{
    protected $table = 'product_img';

    protected $fillable = [
        'url',
        'order',
        'product_id',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}