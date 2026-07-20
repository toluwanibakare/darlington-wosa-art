<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $services = Service::orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($services);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'suited_for' => 'nullable|array',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'message' => 'Service created successfully.',
            'service' => $service,
        ], 201);
    }

    public function show($id)
    {
        $service = Service::findOrFail($id);

        return response()->json($service);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'description' => 'sometimes|string',
            'icon' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'suited_for' => 'nullable|array',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Service updated successfully.',
            'service' => $service,
        ]);
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully.',
        ]);
    }
}
