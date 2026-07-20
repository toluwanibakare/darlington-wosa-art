<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $fillable = [
        'email', 'is_subscribed',
    ];

    protected function casts(): array
    {
        return [
            'is_subscribed' => 'boolean',
        ];
    }
}
