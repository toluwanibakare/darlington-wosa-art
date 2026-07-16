<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReferralController extends Controller
{
    public function index(Request $request)
    {
        $referrals = $request->user()->referrals()->with('referee')->latest()->get();

        return response()->json([
            'referrals' => $referrals,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255',
        ]);

        $referral = $request->user()->referrals()->create([
            'code' => 'REF-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'reward_points' => 100,
        ]);

        return response()->json([
            'message' => 'Referral created successfully.',
            'referral' => $referral,
        ], 201);
    }
}
