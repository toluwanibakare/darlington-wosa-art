<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json([
            'services' => Service::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function show($id)
    {
        $service = Service::where('is_active', true)->findOrFail($id);

        return response()->json([
            'service' => $service,
        ]);
    }
}
