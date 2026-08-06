<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    private string $secretKey;

    public function __construct()
    {
        // Fetch live mode boolean flag from settings
        try {
            $isLive = \App\Models\Setting::where('key', 'korapay_live_mode')->value('value');
            if ($isLive === '1' || $isLive === 'true') {
                $this->secretKey = env('KORAPAY_LIVE_SECRET_KEY') ?: env('KORAPAY_SECRET_KEY') ?: '';
            } else {
                $this->secretKey = env('KORAPAY_TEST_SECRET_KEY') ?: env('KORAPAY_SECRET_KEY') ?: '';
            }
        } catch (\Exception $e) {
            $this->secretKey = env('KORAPAY_SECRET_KEY') ?: '';
        }
    }

    protected function korapayHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->secretKey,
            'Content-Type' => 'application/json',
        ];
    }

    public function initialize(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'currency' => 'nullable|string|size:3',
            'reference' => 'required|string',
            'customer_email' => 'required|email',
            'customer_name' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $payload = [
            'amount' => (float) $request->amount,
            'currency' => $request->currency ?? 'NGN',
            'reference' => $request->reference,
            'customer' => [
                'email' => $request->customer_email,
                'name' => $request->customer_name ?? '',
            ],
            'metadata' => $request->metadata ?? [],
            'notification_url' => url('/api/payments/webhook'),
        ];

        $response = Http::withHeaders($this->korapayHeaders())
            ->post('https://api.korapay.com/merchant/api/v1/charges/initialize', $payload);

        if (!$response->successful()) {
            \Illuminate\Support\Facades\Log::error('Korapay initialization failed', [
                'payload' => $payload,
                'status' => $response->status(),
                'response' => $response->json()
            ]);
            return response()->json([
                'success' => false,
                'message' => $response->json()['message'] ?? 'Payment initialization failed',
                'error' => $response->json(),
            ], 400);
        }

        $data = $response->json();

        return response()->json([
            'success' => true,
            'data' => [
                'authorization_url' => $data['data']['checkout_url'] ?? $data['data']['authorization_url'] ?? null,
                'reference' => $request->reference,
                'access_code' => $data['data']['access_code'] ?? null,
            ],
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate(['reference' => 'required|string']);

        $response = Http::withHeaders($this->korapayHeaders())
            ->get("https://api.korapay.com/merchant/api/v1/charges/{$request->reference}");

        if (!$response->successful()) {
            return response()->json([
                'success' => false,
                'message' => 'Verification failed',
            ], 400);
        }

        $data = $response->json()['data'] ?? [];

        return response()->json([
            'success' => true,
            'data' => [
                'reference' => $data['reference'] ?? '',
                'amount' => $data['amount'] ?? 0,
                'currency' => $data['currency'] ?? 'NGN',
                'status' => $data['status'] ?? 'unknown',
                'paid_at' => $data['paid_at'] ?? null,
                'customer' => $data['customer'] ?? null,
            ],
        ]);
    }

    public function webhook(Request $request)
    {
        $payload = $request->all();
        $event = $payload['event'] ?? '';
        $data = $payload['data'] ?? [];

        if ($event === 'charge.success') {
            $reference = $data['reference'] ?? '';

            $order = \App\Models\Order::where('order_number', $reference)->first();
            if ($order && $order->status === 'pending') {
                $oldStatus = $order->status;
                $order->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                    'payment_method' => 'korapay',
                ]);

                // Determine target email for order receipt/tracking link
                $email = null;
                if ($order->user) {
                    $email = $order->user->email;
                } else {
                    // 1. Try parsing email from Korapay webhook customer data
                    $customerEmail = $data['customer']['email'] ?? null;
                    if ($customerEmail) {
                        $email = $customerEmail;
                    } else {
                        // 2. Fallback: Parse guest email address directly from order description using regex lookup
                        if (preg_match('/Customer Email:\s*([^\s\n\r]+)/i', $order->description, $matches)) {
                            $email = trim($matches[1]);
                        }
                    }
                }

                if ($email) {
                    try {
                        \Illuminate\Support\Facades\Mail::to($email)->send(new \App\Mail\OrderStatusEmail($order, $oldStatus));
                    } catch (\Exception $e) {
                        \Illuminate\Support\Facades\Log::error('Order receipt email failed to send', [
                            'order' => $order->order_number,
                            'error' => $e->getMessage()
                        ]);
                    }
                }
            }
        }

        return response()->json(['success' => true]);
    }
}
