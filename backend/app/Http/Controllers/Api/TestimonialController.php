<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::approved()
            ->where('is_active', true)
            ->latest()
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'name' => $t->name,
                    'role' => $t->role,
                    'quote' => $t->quote,
                    'rating' => $t->rating,
                    'image' => $t->image ? url('storage/' . $t->image) : null,
                    'avatar' => $t->avatar,
                    'created_at' => $t->created_at,
                ];
            });

        return response()->json([
            'testimonials' => $testimonials,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'quote' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $testimonial = new Testimonial();

        if ($request->user()) {
            $testimonial->user_id = $request->user()->id;
            $testimonial->name = $validated['name'] ?: $request->user()->name;
        } else {
            $testimonial->name = $validated['name'] ?: 'Anonymous';
        }

        $testimonial->role = $validated['role'] ?? null;
        $testimonial->quote = $validated['quote'];
        $testimonial->rating = $validated['rating'];
        $testimonial->is_active = false;
        $testimonial->status = 'pending';

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('testimonials', 'public');
            $testimonial->image = $path;
        }

        $testimonial->save();

        return response()->json([
            'message' => 'Thank you for your review! It will be visible after approval.',
            'testimonial' => [
                'id' => $testimonial->id,
                'name' => $testimonial->name,
                'role' => $testimonial->role,
                'quote' => $testimonial->quote,
                'rating' => $testimonial->rating,
                'image' => $testimonial->image ? url('storage/' . $testimonial->image) : null,
            ],
        ], 201);
    }

    public function stats()
    {
        $stats = Testimonial::approved()->where('is_active', true)
            ->selectRaw('COALESCE(AVG(rating), 0) as average_rating')
            ->selectRaw('COUNT(*) as total_reviews')
            ->selectRaw('SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star')
            ->selectRaw('SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star')
            ->selectRaw('SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star')
            ->selectRaw('SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star')
            ->selectRaw('SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star')
            ->first();

        return response()->json($stats);
    }
}
