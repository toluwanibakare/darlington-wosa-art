<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index(Request $request)
    {
        $coupons = $request->user()->coupons()->latest()->get();

        $stats = [
            'active' => $coupons->where('status', 'active')->count(),
            'expired' => $coupons->where('status', 'expired')->count(),
            'total_saved' => (float) $coupons->sum('discount_value'),
        ];

        return response()->json([
            'coupons' => $coupons,
            'stats' => $stats,
        ]);
    }
}
