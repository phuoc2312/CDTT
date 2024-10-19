<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => false,
                'message' => 'Email hoặc mật khẩu không chính xác',
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Đăng nhập thành công',
            'access_token' => $token,
            'username' => $user->username, // Trả về username để hiển thị
            'token_type' => 'Bearer',
        ]);
    }




    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:user',
                'password' => 'required|string|min:8',
                'passwordconfirmation' => 'required|string|same:password',
                'phone' => 'required|string|max:20',
                'address' => 'nullable|string|max:255',
                'gender' => 'nullable|string|max:10',
            ]);


            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'gender' => $request->gender,
                'password' => Hash::make($request->password),
            ]);


            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Đăng ký thành công',
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Đăng ký thất bại: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function index(Request $request)
    {
        $users = User::all();

        return response()->json([
            'status' => true,
            'user' => $users,
        ]);
    }

    // Hàm hiển thị profile
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    // Hàm đăng xuất
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return response()->json([
            'status' => true,
            'message' => 'Đăng xuất thành công',
        ]);
    }
}
