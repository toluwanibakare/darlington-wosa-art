<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classes;

class ClassController extends Controller
{
    public function index()
    {
        return response()->json([
            'classes' => Classes::where('is_active', true)->get(),
        ]);
    }

    public function show($id)
    {
        $class = Classes::where('is_active', true)->findOrFail($id);

        return response()->json([
            'class' => $class,
        ]);
    }
}
