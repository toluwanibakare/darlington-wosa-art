<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NewsletterController extends Controller
{
    public function subscribers()
    {
        $subscribers = NewsletterSubscriber::where('is_subscribed', true)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($subscribers);
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string|in:all,single',
            'user_id' => 'required_if:type,single|exists:users,id',
        ]);

        $notifications = [];

        if ($validated['type'] === 'all') {
            $users = User::all();
            foreach ($users as $user) {
                $notifications[] = [
                    'user_id' => $user->id,
                    'title' => $validated['subject'],
                    'message' => $validated['content'],
                    'type' => 'newsletter',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        } else {
            $notifications[] = [
                'user_id' => $validated['user_id'],
                'title' => $validated['subject'],
                'message' => $validated['content'],
                'type' => 'newsletter',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach (array_chunk($notifications, 100) as $chunk) {
            Notification::insert($chunk);
        }

        return response()->json([
            'message' => 'Notification sent successfully.',
            'recipients' => count($notifications),
        ]);
    }

    public function destroy($id)
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);
        $subscriber->delete();

        return response()->json([
            'message' => 'Subscriber deleted successfully.',
        ]);
    }
}
