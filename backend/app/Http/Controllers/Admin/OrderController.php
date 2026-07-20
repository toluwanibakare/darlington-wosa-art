<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'service']);

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'service'])->findOrFail($id);

        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|string|in:pending,processing,completed,cancelled,refunded',
            'payment_method' => 'nullable|string|max:50',
            'paid_at' => 'nullable|date',
        ]);

        $order->update($validated);

        return response()->json([
            'message' => 'Order updated successfully.',
            'order' => $order,
        ]);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully.',
        ]);
    }
}
