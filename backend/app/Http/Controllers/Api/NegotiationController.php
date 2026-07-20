<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Negotiation;
use App\Models\ShopItem;
use Illuminate\Http\Request;

class NegotiationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shop_item_id' => 'required|exists:shop_items,id',
            'offered_price' => 'required|numeric|min:0.01',
            'message' => 'nullable|string|max:1000',
        ]);

        $item = ShopItem::findOrFail($validated['shop_item_id']);
        if (!$item->is_negotiable) {
            return response()->json(['error' => 'This item is not available for negotiation.'], 400);
        }

        $negotiation = Negotiation::create([
            'shop_item_id' => $item->id,
            'user_id' => $request->user()?->id,
            'offered_price' => $validated['offered_price'],
            'message' => $validated['message'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Your offer has been submitted. The admin will review it shortly.',
            'negotiation' => $negotiation,
        ], 201);
    }
}
