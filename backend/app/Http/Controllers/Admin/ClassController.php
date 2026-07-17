<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ClassController extends Controller
{
    public function index(Request $request)
    {
        $classes = Classes::orderBy('created_at', 'desc')->paginate(20);

        return response()->json($classes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:classes,slug',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|string|max:100',
            'max_students' => 'nullable|integer|min:1',
            'level' => 'nullable|string|max:100',
            'image' => 'nullable|string|max:500',
            'instructor' => 'nullable|string|max:255',
            'schedule' => 'nullable|string|max:500',
            'is_active' => 'sometimes|boolean',
        ]);

        if (!isset($validated['slug']) || empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $class = Classes::create($validated);

        return response()->json([
            'message' => 'Class created successfully.',
            'class' => $class,
        ], 201);
    }

    public function show($id)
    {
        $class = Classes::withCount('bookings')->findOrFail($id);

        return response()->json($class);
    }

    public function update(Request $request, $id)
    {
        $class = Classes::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255|unique:classes,slug,' . $id,
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'duration' => 'sometimes|string|max:100',
            'max_students' => 'nullable|integer|min:1',
            'level' => 'nullable|string|max:100',
            'image' => 'nullable|string|max:500',
            'instructor' => 'nullable|string|max:255',
            'schedule' => 'nullable|string|max:500',
            'is_active' => 'sometimes|boolean',
        ]);

        if (!isset($validated['slug']) || empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title'] ?? $class->title);
        }

        $class->update($validated);

        return response()->json([
            'message' => 'Class updated successfully.',
            'class' => $class,
        ]);
    }

    public function destroy($id)
    {
        $class = Classes::findOrFail($id);
        $class->delete();

        return response()->json([
            'message' => 'Class deleted successfully.',
        ]);
    }
}
