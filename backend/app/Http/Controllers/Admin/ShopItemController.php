<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShopItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ShopItemController extends Controller
{
    public function index(Request $request)
    {
        $query = ShopItem::with('category');

        if ($categoryId = $request->get('category_id')) {
            $query->where('category_id', $categoryId);
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')->paginate(20)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:shop_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'is_negotiable' => 'sometimes|boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_active' => 'sometimes|boolean',
            'is_sold' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('images')) {
            $paths = [];
            foreach ($request->file('images') as $image) {
                $paths[] = $image->store('shop/items', 'public');
            }
            $validated['images'] = $paths;
        }

        $item = ShopItem::create($validated);

        return response()->json(['message' => 'Item created.', 'item' => $item], 201);
    }

    public function show($id)
    {
        return response()->json(ShopItem::with('category')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $item = ShopItem::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'nullable|exists:shop_categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'is_negotiable' => 'sometimes|boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_active' => 'sometimes|boolean',
            'is_sold' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('images')) {
            $paths = $item->images ?? [];
            foreach ($request->file('images') as $image) {
                $paths[] = $image->store('shop/items', 'public');
            }
            $validated['images'] = $paths;
        }

        $item->update($validated);

        return response()->json(['message' => 'Item updated.', 'item' => $item]);
    }

    public function destroy($id)
    {
        ShopItem::findOrFail($id)->delete();
        return response()->json(['message' => 'Item deleted.']);
    }
}
