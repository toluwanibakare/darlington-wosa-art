<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCoupon extends Model
{
    protected $table = 'user_coupons';

    protected $fillable = [
        'user_id', 'code', 'description', 'discount_type',
        'discount_value', 'usage_limit', 'used_count', 'expires_at', 'status',
    ];

    protected function casts(): array
    {
        return [
            'discount_value' => 'decimal:2',
            'expires_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
