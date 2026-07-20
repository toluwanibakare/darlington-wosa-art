<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShopCategory;
use App\Models\ShopItem;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function categories()
    {
        $categories = ShopCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->withCount(['activeItems'])
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'description' => $c->description,
                'image' => $c->image ? url('storage/' . $c->image) : null,
                'item_count' => $c->active_items_count,
            ]);

        return response()->json(['categories' => $categories]);
    }

    public function items(Request $request)
    {
        $query = ShopItem::where('is_active', true)
            ->where('is_sold', false)
            ->with('category');

        if ($categorySlug = $request->get('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        $items = $query->orderBy('sort_order')
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'name' => $i->name,
                'slug' => $i->slug,
                'description' => $i->description,
                'price' => $i->price,
                'is_negotiable' => $i->is_negotiable,
                'images' => $i->images ? array_map(fn ($img) => url('storage/' . $img), $i->images) : [],
                'category' => $i->category ? ['id' => $i->category->id, 'name' => $i->category->name, 'slug' => $i->category->slug] : null,
                'is_sold' => $i->is_sold,
            ]);

        return response()->json(['items' => $items]);
    }

    public function show($id)
    {
        $item = ShopItem::where('is_active', true)->with('category')->findOrFail($id);

        return response()->json([
            'item' => [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'description' => $item->description,
                'price' => $item->price,
                'is_negotiable' => $item->is_negotiable,
                'images' => $item->images ? array_map(fn ($img) => url('storage/' . $img), $item->images) : [],
                'category' => $item->category ? ['id' => $item->category->id, 'name' => $item->category->name, 'slug' => $item->category->slug] : null,
            ],
        ]);
    }
}
