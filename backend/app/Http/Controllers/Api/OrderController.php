<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('service')->latest()->get();

        return response()->json([
            'orders' => $orders,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'nullable|exists:services,id',
            'description' => 'nullable|string|max:2000',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string|max:100',
        ]);

        $order = $request->user()->orders()->create([
            'service_id' => $validated['service_id'] ?? null,
            'order_number' => 'ORD-' . strtoupper(Str::random(10)),
            'description' => $validated['description'] ?? null,
            'amount' => $validated['amount'],
            'status' => 'pending',
            'payment_method' => $validated['payment_method'] ?? null,
        ]);

        $order->load('service');

        return response()->json([
            'message' => 'Order placed successfully.',
            'order' => $order,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()->with('service')->findOrFail($id);

        return response()->json([
            'order' => $order,
        ]);
    }
}
