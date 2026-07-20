<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Classes;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\User;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_orders' => Order::count(),
            'total_revenue' => (float) Order::where('status', 'completed')->sum('amount'),
            'total_bookings' => Booking::count(),
            'unread_messages' => ContactMessage::whereNull('read_at')->count(),
            'total_subscribers' => NewsletterSubscriber::where('is_subscribed', true)->count(),
            'total_classes' => Classes::count(),
        ]);
    }
}
