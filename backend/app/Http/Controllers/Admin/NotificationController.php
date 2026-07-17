<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function sendToAll(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'nullable|string|max:50',
        ]);

        $users = User::pluck('id');
        $notifications = [];

        foreach ($users as $userId) {
            $notifications[] = [
                'user_id' => $userId,
                'title' => $validated['title'],
                'message' => $validated['message'],
                'type' => $validated['type'] ?? 'announcement',
                'is_read' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach (array_chunk($notifications, 100) as $chunk) {
            Notification::insert($chunk);
        }

        return response()->json([
            'message' => 'Notification sent to all users successfully.',
            'recipients' => count($notifications),
        ]);
    }

    public function sendToUser(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'nullable|string|max:50',
        ]);

        $notification = Notification::create([
            'user_id' => $validated['user_id'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'type' => $validated['type'] ?? 'announcement',
        ]);

        return response()->json([
            'message' => 'Notification sent successfully.',
            'notification' => $notification,
        ], 201);
    }
}
