<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $query = Testimonial::orderBy('created_at', 'desc');

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $testimonials = $query->paginate(20);

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
            'status' => 'sometimes|in:pending,approved,rejected',
            'admin_reply' => 'nullable|string',
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
            'status' => 'sometimes|in:pending,approved,rejected',
            'admin_reply' => 'nullable|string',
        ]);

        $testimonial->update($validated);

        return response()->json([
            'message' => 'Testimonial updated successfully.',
            'testimonial' => $testimonial,
        ]);
    }

    public function approve($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update(['status' => 'approved', 'is_active' => true]);

        return response()->json([
            'message' => 'Testimonial approved.',
            'testimonial' => $testimonial,
        ]);
    }

    public function reject(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $validated = $request->validate(['admin_reply' => 'nullable|string']);
        $testimonial->update([
            'status' => 'rejected',
            'is_active' => false,
            'admin_reply' => $validated['admin_reply'] ?? null,
        ]);

        return response()->json([
            'message' => 'Testimonial rejected.',
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
