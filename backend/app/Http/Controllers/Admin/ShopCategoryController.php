<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShopCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ShopCategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            ShopCategory::orderBy('sort_order')->withCount('items')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('shop/categories', 'public');
        }

        $category = ShopCategory::create($validated);

        return response()->json(['message' => 'Category created.', 'category' => $category], 201);
    }

    public function show($id)
    {
        return response()->json(ShopCategory::with('items')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $category = ShopCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('shop/categories', 'public');
        }

        $category->update($validated);

        return response()->json(['message' => 'Category updated.', 'category' => $category]);
    }

    public function destroy($id)
    {
        ShopCategory::findOrFail($id)->delete();
        return response()->json(['message' => 'Category deleted.']);
    }
}
