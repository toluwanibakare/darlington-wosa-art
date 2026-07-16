<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index()
    {
        return response()->json([
            'videos' => Video::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'url' => 'required|string',
            'thumbnail' => 'nullable|string',
            'category' => 'nullable|string|max:100',
        ]);

        $video = Video::create([
            'user_id' => $request->user()?->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'url' => $validated['url'],
            'thumbnail' => $validated['thumbnail'] ?? null,
            'category' => $validated['category'] ?? null,
        ]);

        return response()->json([
            'message' => 'Video submitted successfully.',
            'video' => $video,
        ], 201);
    }
}
