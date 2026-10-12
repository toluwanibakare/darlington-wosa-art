<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactAcknowledgementEmail;
use App\Mail\ContactReceivedEmail;
use App\Models\ContactMessage;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $contact = ContactMessage::create($validated);

        $this->sendNotifications($contact);

        return response()->json([
            'message' => 'Message sent successfully. We will get back to you shortly.',
            'contact' => $contact,
        ], 201);
    }

    private function sendNotifications(ContactMessage $contact): void
    {
        $studioEmail = Setting::getValue('notification_email') ?: config('mail.from.address');

        try {
            Mail::to($studioEmail)->send(new ContactReceivedEmail($contact));
        } catch (\Throwable $e) {
            Log::error('Contact notification to studio failed', ['error' => $e->getMessage()]);
        }

        try {
            Mail::to($contact->email)->send(new ContactAcknowledgementEmail($contact));
        } catch (\Throwable $e) {
            Log::error('Contact acknowledgement failed', ['error' => $e->getMessage()]);
        }
    }
}
