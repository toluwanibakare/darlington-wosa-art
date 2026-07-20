<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Negotiation;
use Illuminate\Http\Request;

class NegotiationController extends Controller
{
    public function index(Request $request)
    {
        $query = Negotiation::with(['shopItem', 'user']);

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')->paginate(20)
        );
    }

    public function respond(Request $request, $id)
    {
        $negotiation = Negotiation::with('shopItem')->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:accepted,declined,countered',
            'admin_response' => 'nullable|string|max:2000',
        ]);

        $negotiation->update($validated);

        if ($validated['status'] === 'accepted' && $negotiation->shopItem) {
            $negotiation->shopItem->update(['is_sold' => true]);
        }

        return response()->json([
            'message' => 'Negotiation updated.',
            'negotiation' => $negotiation,
        ]);
    }
}
