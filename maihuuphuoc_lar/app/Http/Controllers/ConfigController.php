<?php

namespace App\Http\Controllers;

use App\Models\Config;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
    public function index()
    {
        $config = Config::all();
        return response()->json($config);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'site_name' => 'required|string',
            'email' => 'required|email',
            'address' => 'required|string',
            'hotline' => 'required|string',
            'phone' => 'required|string',
            'author' => 'required|string',
            'status' => 'required|boolean', // Đảm bảo trạng thái là boolean
        ]);

        $config = Config::create($validatedData);

        return response()->json($config, 201);
    }

    public function update(Request $request, $id)
    {
        $config = Config::findOrFail($id);

        $validatedData = $request->validate([
            'site_name' => 'sometimes|required|string',
            'email' => 'sometimes|required|email',
            'address' => 'sometimes|required|string',
            'hotline' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'author' => 'sometimes|required|string',
            'status' => 'sometimes|required|boolean', // Đảm bảo trạng thái là boolean
        ]);

        $config->update($validatedData);

        return response()->json($config);
    }

    public function destroy($id)
    {
        $config = Config::findOrFail($id);
        $config->delete(); // Thực hiện xóa mềm

        return response()->json(['message' => 'Config deleted successfully']);
    }
}
