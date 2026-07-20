<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::with(['user', 'class'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($bookings);
    }

    public function show($id)
    {
        $booking = Booking::with(['user', 'class'])->findOrFail($id);

        return response()->json($booking);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|string|in:pending,confirmed,cancelled,completed',
            'notes' => 'nullable|string',
        ]);

        $booking->update($validated);

        return response()->json([
            'message' => 'Booking updated successfully.',
            'booking' => $booking,
        ]);
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json([
            'message' => 'Booking deleted successfully.',
        ]);
    }
}
