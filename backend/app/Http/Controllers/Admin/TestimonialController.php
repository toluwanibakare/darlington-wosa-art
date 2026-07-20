<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\TestimonialStatusEmail;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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

        if ($testimonial->user) {
            try {
                Mail::to($testimonial->user->email)->send(new TestimonialStatusEmail($testimonial));
            } catch (\Exception $e) {
                report($e);
            }
            $testimonial->user->notifications()->create([
                'title' => 'Testimonial Approved',
                'message' => 'Your testimonial has been approved and is now visible on our website.',
                'type' => 'testimonial',
            ]);
        }

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

        if ($testimonial->user) {
            try {
                Mail::to($testimonial->user->email)->send(new TestimonialStatusEmail($testimonial));
            } catch (\Exception $e) {
                report($e);
            }
            $testimonial->user->notifications()->create([
                'title' => 'Testimonial Update',
                'message' => $validated['admin_reply']
                    ? 'Your testimonial has been reviewed. Admin response: ' . $validated['admin_reply']
                    : 'Your testimonial has been reviewed.',
                'type' => 'testimonial',
            ]);
        }

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
