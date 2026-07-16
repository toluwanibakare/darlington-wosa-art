<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;

class VideoController extends Controller
{
    public function index()
    {
        return response()->json([
            'videos' => Video::latest()->get(),
        ]);
    }
}
