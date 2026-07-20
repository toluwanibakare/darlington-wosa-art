<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reward;
use Illuminate\Http\Request;

class RewardController extends Controller
{
    public function index(Request $request)
    {
        $query = Reward::with('user:id,name,email');

        if ($userId = $request->get('user_id')) {
            $query->where('user_id', $userId);
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')->paginate(20)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'points' => 'required|integer|min:1',
            'type' => 'required|in:earned,redeemed',
            'description' => 'nullable|string|max:500',
        ]);

        $reward = Reward::create($validated);

        return response()->json([
            'message' => 'Reward created.',
            'reward' => $reward->load('user:id,name,email'),
        ], 201);
    }

    public function destroy($id)
    {
        Reward::findOrFail($id)->delete();
        return response()->json(['message' => 'Reward deleted.']);
    }
}
