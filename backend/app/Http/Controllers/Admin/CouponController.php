<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserCoupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index(Request $request)
    {
        $coupons = UserCoupon::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($coupons);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'code' => 'required|string|max:50|unique:user_coupons,code',
            'description' => 'nullable|string',
            'discount_type' => 'required|string|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'used_count' => 'nullable|integer|min:0',
            'expires_at' => 'nullable|date',
            'status' => 'sometimes|string|in:active,inactive,expired',
        ]);

        $coupon = UserCoupon::create($validated);

        return response()->json([
            'message' => 'Coupon created successfully.',
            'coupon' => $coupon,
        ], 201);
    }

    public function show($id)
    {
        $coupon = UserCoupon::with('user')->findOrFail($id);

        return response()->json($coupon);
    }

    public function update(Request $request, $id)
    {
        $coupon = UserCoupon::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'code' => 'sometimes|string|max:50|unique:user_coupons,code,' . $id,
            'description' => 'nullable|string',
            'discount_type' => 'sometimes|string|in:percentage,fixed',
            'discount_value' => 'sometimes|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'used_count' => 'nullable|integer|min:0',
            'expires_at' => 'nullable|date',
            'status' => 'sometimes|string|in:active,inactive,expired',
        ]);

        $coupon->update($validated);

        return response()->json([
            'message' => 'Coupon updated successfully.',
            'coupon' => $coupon,
        ]);
    }

    public function destroy($id)
    {
        $coupon = UserCoupon::findOrFail($id);
        $coupon->delete();

        return response()->json([
            'message' => 'Coupon deleted successfully.',
        ]);
    }
}
