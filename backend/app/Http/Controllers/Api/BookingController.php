<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = $request->user()->bookings()->with('class')->latest()->get();

        return response()->json([
            'bookings' => $bookings,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'nullable|exists:classes,id',
            'attendees' => 'integer|min:1|max:10',
            'notes' => 'nullable|string|max:1000',
        ]);

        $booking = $request->user()->bookings()->create([
            'class_id' => $validated['class_id'] ?? null,
            'booking_number' => 'BK-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'attendees' => $validated['attendees'] ?? 1,
            'notes' => $validated['notes'] ?? null,
        ]);

        $booking->load('class');

        return response()->json([
            'message' => 'Booking created successfully.',
            'booking' => $booking,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $booking = $request->user()->bookings()->with('class')->findOrFail($id);

        return response()->json([
            'booking' => $booking,
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $booking = $request->user()->bookings()->findOrFail($id);

        if ($booking->status === 'cancelled') {
            return response()->json([
                'message' => 'Booking is already cancelled.',
            ], 400);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Booking cancelled successfully.',
            'booking' => $booking,
        ]);
    }
}
