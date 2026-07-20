<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use App\Models\Reward;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $referrals = $user->referrals()->with('referee')->latest()->get();

        $stats = [
            'total' => $referrals->count(),
            'successful' => $referrals->where('status', 'completed')->count(),
            'pending' => $referrals->where('status', 'pending')->count(),
            'earnings' => (float) $user->transactions()
                ->where('type', 'credit')
                ->where('source', 'referral')
                ->sum('amount'),
        ];

        return response()->json([
            'referrals' => $referrals,
            'stats' => $stats,
            'referral_code' => $user->referral_code,
            'referral_link' => url('/ref/' . $user->referral_code),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255',
        ]);

        $user = $request->user();
        $referredUser = User::where('email', $validated['email'])->first();

        if ($referredUser && $referredUser->id === $user->id) {
            return response()->json([
                'message' => 'You cannot refer yourself.',
            ], 400);
        }

        $existing = Referral::where('referrer_id', $user->id)
            ->whereHas('referee', function ($q) use ($validated) {
                $q->where('email', $validated['email']);
            })->first();

        if ($existing) {
            return response()->json([
                'message' => 'This email has already been referred.',
            ], 400);
        }

        $referral = $user->referrals()->create([
            'code' => $user->referral_code,
            'referee_id' => $referredUser?->id,
            'status' => $referredUser ? 'completed' : 'pending',
            'reward_points' => 100,
        ]);

        if ($referredUser) {
            $reward = $user->rewards()->create([
                'points' => 100,
                'type' => 'earned',
                'description' => 'Referral reward for inviting ' . $referredUser->name,
            ]);

            $user->increment('wallet_balance', 100);
            $user->transactions()->create([
                'amount' => 100,
                'type' => 'credit',
                'description' => 'Referral reward for ' . $referredUser->name,
                'source' => 'referral',
            ]);
        }

        return response()->json([
            'message' => 'Referral submitted successfully.',
            'referral' => $referral,
        ], 201);
    }
}
