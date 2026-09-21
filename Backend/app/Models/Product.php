<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'prix',
        'prix_remise',
        'stock',
        'coop_id',
        'cat_id',
    ];

    protected function casts(): array
    {
        return [
            'prix' => 'decimal:2',
            'prix_remise' => 'decimal:2',
            'stock' => 'integer',
        ];
    }

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
        return $this->hasMany(ProductImg::class, 'product_id')->orderBy('order');
    }

    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class, 'product_id');
    }

    public function panierItems(): HasMany
    {
        return $this->hasMany(PanierItem::class, 'product_id');
    }

    public function commandLignes(): HasMany
    {
        return $this->hasMany(CommandLigne::class, 'product_id');
    }

    public function effectivePrice(): string
    {
        return (string) ($this->prix_remise ?? $this->prix);
    }

    public static function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'produit';
        $slug = $base;
        $i = 1;

        while (static::query()
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
