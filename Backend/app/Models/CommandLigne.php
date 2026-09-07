<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommandLigne extends Model
{
    protected $fillable = [
        'quantity',
        'prix_unitaire',
        'command_id',
        'product_id',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'prix_unitaire' => 'decimal:2',
    ];

    public function command(): BelongsTo
    {
        return $this->belongsTo(Command::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}