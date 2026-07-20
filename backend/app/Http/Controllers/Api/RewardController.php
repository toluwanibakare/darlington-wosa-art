<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RewardController extends Controller
{
    public function index(Request $request)
    {
        $rewards = $request->user()->rewards()->latest()->get();

        return response()->json([
            'rewards' => $rewards,
        ]);
    }

    public function total(Request $request)
    {
        $total = $request->user()->rewards()
            ->where('type', 'earned')
            ->sum('points');

        $redeemed = $request->user()->rewards()
            ->where('type', 'redeemed')
            ->sum('points');

        return response()->json([
            'total_points' => $total - $redeemed,
            'earned' => $total,
            'redeemed' => $redeemed,
        ]);
    }
}
