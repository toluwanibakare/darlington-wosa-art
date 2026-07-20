<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function index(Request $request)
    {
        $query = Referral::with(['referrer:id,name,email', 'referee:id,name,email']);

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')->paginate(20)
        );
    }
}
