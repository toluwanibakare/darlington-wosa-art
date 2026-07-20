<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $query = PortfolioItem::query();

        if ($category = $request->get('category')) {
            $query->where('category', $category);
        }

        $items = $query->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:50',
            'src' => 'nullable|string|max:500',
            'thumb' => 'nullable|string|max:500',
            'width' => 'nullable|integer',
            'height' => 'nullable|integer',
            'description' => 'nullable|string',
            'client' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:10',
            'medium' => 'nullable|string|max:255',
            'video_src' => 'nullable|string|max:500',
            'video_embed' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $item = PortfolioItem::create($validated);

        return response()->json([
            'message' => 'Portfolio item created successfully.',
            'item' => $item,
        ], 201);
    }

    public function show($id)
    {
        $item = PortfolioItem::findOrFail($id);

        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = PortfolioItem::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:50',
            'src' => 'nullable|string|max:500',
            'thumb' => 'nullable|string|max:500',
            'width' => 'nullable|integer',
            'height' => 'nullable|integer',
            'description' => 'nullable|string',
            'client' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:10',
            'medium' => 'nullable|string|max:255',
            'video_src' => 'nullable|string|max:500',
            'video_embed' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $item->update($validated);

        return response()->json([
            'message' => 'Portfolio item updated successfully.',
            'item' => $item,
        ]);
    }

    public function destroy($id)
    {
        $item = PortfolioItem::findOrFail($id);
        $item->delete();

        return response()->json([
            'message' => 'Portfolio item deleted successfully.',
        ]);
    }
}
