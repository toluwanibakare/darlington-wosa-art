<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopCategory extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'image', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(ShopItem::class, 'category_id');
    }

    public function activeItems(): HasMany
    {
        return $this->hasMany(ShopItem::class, 'category_id')
            ->where('is_active', true)
            ->where('is_sold', false);
    }
}
