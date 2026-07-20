<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'title', 'tagline', 'description', 'icon', 'price',
        'suited_for', 'sort_order', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'suited_for' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
