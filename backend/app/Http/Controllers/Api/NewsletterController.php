<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255',
        ]);

        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['email' => $validated['email']],
            ['is_subscribed' => true]
        );

        if (!$subscriber->wasRecentlyCreated && $subscriber->is_subscribed) {
            return response()->json([
                'message' => 'You are already subscribed to our newsletter.',
            ]);
        }

        if (!$subscriber->is_subscribed) {
            $subscriber->update(['is_subscribed' => true]);
        }

        return response()->json([
            'message' => 'Successfully subscribed to the newsletter.',
            'subscriber' => $subscriber,
        ], 201);
    }

    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255',
        ]);

        $subscriber = NewsletterSubscriber::where('email', $validated['email'])->first();

        if (!$subscriber) {
            return response()->json([
                'message' => 'Email not found in our subscriber list.',
            ]);
        }

        $subscriber->update(['is_subscribed' => false]);

        return response()->json([
            'message' => 'Successfully unsubscribed from the newsletter.',
        ]);
    }
}
