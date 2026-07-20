<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderStatusEmail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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
        $oldStatus = $order->status;

        $validated = $request->validate([
            'status' => 'sometimes|string|in:pending,processing,completed,cancelled,refunded',
            'payment_method' => 'nullable|string|max:50',
            'paid_at' => 'nullable|date',
        ]);

        $order->update($validated);

        if ($order->user && $oldStatus !== $order->status) {
            try {
                Mail::to($order->user->email)->send(new OrderStatusEmail($order, $oldStatus));
            } catch (\Exception $e) {
                report($e);
            }

            $order->user->notifications()->create([
                'title' => "Order #{$order->order_number} - {$order->status}",
                'message' => "Your order status changed from {$oldStatus} to {$order->status}.",
                'type' => 'order',
            ]);
        }

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
