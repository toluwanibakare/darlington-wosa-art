<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Negotiation extends Model
{
    protected $fillable = [
        'shop_item_id', 'user_id', 'offered_price', 'message',
        'status', 'admin_response',
    ];

    protected function casts(): array
    {
        return [
            'offered_price' => 'decimal:2',
        ];
    }

    public function shopItem(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
