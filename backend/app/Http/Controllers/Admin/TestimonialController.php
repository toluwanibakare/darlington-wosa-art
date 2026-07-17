<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $testimonials = Testimonial::orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($testimonials);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'quote' => 'required|string',
            'avatar' => 'nullable|string|max:500',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_active' => 'sometimes|boolean',
        ]);

        $testimonial = Testimonial::create($validated);

        return response()->json([
            'message' => 'Testimonial created successfully.',
            'testimonial' => $testimonial,
        ], 201);
    }

    public function show($id)
    {
        $testimonial = Testimonial::findOrFail($id);

        return response()->json($testimonial);
    }

    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'role' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'quote' => 'sometimes|string',
            'avatar' => 'nullable|string|max:500',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_active' => 'sometimes|boolean',
        ]);

        $testimonial->update($validated);

        return response()->json([
            'message' => 'Testimonial updated successfully.',
            'testimonial' => $testimonial,
        ]);
    }

    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();

        return response()->json([
            'message' => 'Testimonial deleted successfully.',
        ]);
    }
}
