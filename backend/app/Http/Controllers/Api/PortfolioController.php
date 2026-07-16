<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;

class PortfolioController extends Controller
{
    public function index()
    {
        return response()->json([
            'items' => PortfolioItem::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function show($id)
    {
        $item = PortfolioItem::where('is_active', true)->findOrFail($id);

        return response()->json([
            'item' => $item,
        ]);
    }
}
