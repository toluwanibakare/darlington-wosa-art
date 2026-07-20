<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopItem extends Model
{
    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'price',
        'width', 'height',
        'is_negotiable', 'images', 'is_active', 'is_sold', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'width' => 'decimal:2',
            'height' => 'decimal:2',
            'is_negotiable' => 'boolean',
            'is_active' => 'boolean',
            'is_sold' => 'boolean',
            'images' => 'array',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ShopCategory::class, 'category_id');
    }

    public function negotiations()
    {
        return $this->hasMany(Negotiation::class);
    }
}
