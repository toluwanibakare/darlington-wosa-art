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
        $this->secretKey = config('services.korapay.secret_key') ?: env('KORAPAY_SECRET_KEY');
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
            return response()->json([
                'success' => false,
                'message' => 'Payment initialization failed',
                'error' => $response->json(),
            ], 400);
        }

        $data = $response->json();

        return response()->json([
            'success' => true,
            'data' => [
                'authorization_url' => $data['data']['authorization_url'] ?? null,
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
                $order->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                    'payment_method' => 'korapay',
                ]);
            }
        }

        return response()->json(['success' => true]);
    }
}
