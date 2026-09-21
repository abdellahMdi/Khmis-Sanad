<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommandLigne extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'quantity',
        'prix_unitaire',
        'command_id',
        'product_id',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'prix_unitaire' => 'decimal:2',
        ];
    }

    public function command(): BelongsTo
    {
        return $this->belongsTo(Command::class, 'command_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
