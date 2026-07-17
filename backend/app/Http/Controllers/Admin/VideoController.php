<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index(Request $request)
    {
        $videos = Video::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($videos);
    }

    public function update(Request $request, $id)
    {
        $video = Video::findOrFail($id);

        $validated = $request->validate([
            'category' => 'nullable|string|max:100',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $video->update($validated);

        return response()->json([
            'message' => 'Video updated successfully.',
            'video' => $video,
        ]);
    }

    public function destroy($id)
    {
        $video = Video::findOrFail($id);
        $video->delete();

        return response()->json([
            'message' => 'Video deleted successfully.',
        ]);
    }
}
