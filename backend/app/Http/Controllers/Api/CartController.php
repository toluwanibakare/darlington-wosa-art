<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\ShopItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function getCartQuery(Request $request)
    {
        if ($request->user()) {
            return CartItem::where('user_id', $request->user()->id);
        }
        return CartItem::where('session_id', $request->header('X-Session-Id'));
    }

    public function index(Request $request)
    {
        $items = $this->getCartQuery($request)
            ->with('shopItem.category')
            ->get()
            ->map(fn ($ci) => [
                'id' => $ci->id,
                'quantity' => $ci->quantity,
                'item' => $ci->shopItem ? [
                    'id' => $ci->shopItem->id,
                    'name' => $ci->shopItem->name,
                    'price' => $ci->shopItem->price,
                    'is_negotiable' => $ci->shopItem->is_negotiable,
                    'images' => $ci->shopItem->images ? array_map(fn ($img) => url('storage/' . $img), $ci->shopItem->images) : [],
                    'category' => $ci->shopItem->category ? $ci->shopItem->category->name : null,
                ] : null,
            ]);

        $total = $items->sum(fn ($ci) => ($ci['item']['price'] ?? 0) * $ci['quantity']);

        return response()->json(['items' => $items, 'total' => $total]);
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'shop_item_id' => 'required|exists:shop_items,id',
            'quantity' => 'integer|min:1|max:99',
        ]);

        $item = ShopItem::findOrFail($validated['shop_item_id']);
        if ($item->is_sold || !$item->is_active) {
            return response()->json(['error' => 'This item is not available.'], 400);
        }

        $query = $this->getCartQuery($request);
        $existing = (clone $query)->where('shop_item_id', $item->id)->first();

        if ($existing) {
            $existing->increment('quantity', $validated['quantity'] ?? 1);
        } else {
            $data = [
                'shop_item_id' => $item->id,
                'quantity' => $validated['quantity'] ?? 1,
            ];
            if ($request->user()) {
                $data['user_id'] = $request->user()->id;
            } else {
                $data['session_id'] = $request->header('X-Session-Id');
            }
            CartItem::create($data);
        }

        return response()->json(['message' => 'Added to cart.']);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate(['quantity' => 'required|integer|min:1|max:99']);
        $cartItem = $this->getCartQuery($request)->findOrFail($id);
        $cartItem->update(['quantity' => $validated['quantity']]);
        return response()->json(['message' => 'Cart updated.']);
    }

    public function remove(Request $request, $id)
    {
        $cartItem = $this->getCartQuery($request)->findOrFail($id);
        $cartItem->delete();
        return response()->json(['message' => 'Removed from cart.']);
    }

    public function clear(Request $request)
    {
        $this->getCartQuery($request)->delete();
        return response()->json(['message' => 'Cart cleared.']);
    }
}
