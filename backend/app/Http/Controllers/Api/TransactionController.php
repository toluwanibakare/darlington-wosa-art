<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = $request->user()->transactions()->latest()->get();

        $walletBalance = (float) $request->user()->wallet_balance;

        $credits = $request->user()->transactions()
            ->where('type', 'credit')
            ->where('source', 'referral')
            ->sum('amount');

        $cashback = $request->user()->transactions()
            ->where('type', 'credit')
            ->where('source', 'cashback')
            ->sum('amount');

        $withdrawn = $request->user()->transactions()
            ->where('type', 'debit')
            ->where('source', 'withdrawal')
            ->sum('amount');

        return response()->json([
            'transactions' => $transactions,
            'wallet_balance' => $walletBalance,
            'referral_earnings' => (float) $credits,
            'cashback_earned' => (float) $cashback,
            'total_withdrawn' => (float) $withdrawn,
        ]);
    }
}
