<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        'title', 'slug', 'description', 'price', 'duration',
        'max_students', 'level', 'image', 'instructor', 'schedule', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'class_id');
    }
}
