<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($messages);
    }

    public function show($id)
    {
        $message = ContactMessage::findOrFail($id);

        if (!$message->read_at) {
            $message->markAsRead();
        }

        return response()->json($message);
    }

    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully.',
        ]);
    }
}
