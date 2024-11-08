<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Carbon\Carbon;

class UserController extends Controller
{
    public function register(Request $request) {
        $validator = Validator::make($request->json()->all(), [
            'name' => 'required|string|max:1000',
            'email' => 'required|string|email|max:100|unique:user',
            'phone' => 'nullable|string|max:13',
            'address' => 'nullable|string|max:1000',
            'gender' => 'nullable|string|max:10',
            'username' => 'required|string|max:255|unique:user',
            'password' => 'required|string|min:6|confirmed',
            'roles' => 'nullable|in:customer,admin',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->json()->get('name'),
            'email' => $request->json()->get('email'),
            'phone' => $request->json()->get('phone'),
            'address' => $request->json()->get('address'),
            'gender' => $request->json()->get('gender'),
            'thumbnail' => $request->json()->get('thumbnail'),
            'roles' => $request->json()->get('roles', 'customer'),
            'username' => $request->json()->get('username'),
            'password' => Hash::make($request->json()->get('password')),
            'status' => 1,
            'created_at' => Carbon::now(),
            'created_by' => 1,
        ]);

        // Generate JWT token
        $token = JWTAuth::fromUser($user);

        // Fix: Return 'user' instead of 'users'
        return response()->json(compact('user', 'token'), 201);
    }


    // // Đăng nhập user


    public function login(Request $request) {
        $credentials = $request->only('username', 'password');

        try {
            // Attempt to authenticate the user
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }

        // Lấy thông tin người dùng đã xác thực
        $user = auth()->user();

        // Trả về token và thông tin người dùng
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                // Nếu bạn muốn thêm các trường khác, có thể thêm ở đây
                'email' => $user->email, // Ví dụ: email
                'phone' => $user->phone, // Ví dụ: số điện thoại
                'roles' => $user->roles,
            ]
        ]);
    }


    // Lấy thông tin user đang đăng nhập
    public function getAuthenticatedUser() {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }

        return response()->json(compact('user'));
    }

    public function index()
    {
        $users = User::where('status','!=',2)
            ->select("id","name","email","phone","address","gender","created_at","status","roles")
            ->get();
            if($users->isEmpty()) {
                $result = [
                    'status' => false,
                    'message' => 'Không tìm thấy dữ liệu',
                    'users' => null
                ];
            }
            else {
                $result =[
                    'status'=>true,
                    'message'=>'Tải dữ liệu thành công',
                    'users'=>$users
                ];
            }
        return response()->json($result);
    }
    public function show($id)
{
    // Tìm người dùng theo ID
    $user = User::find($id);

    // Kiểm tra xem người dùng có tồn tại hay không
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Trả về thông tin người dùng
    return response()->json($user);
}

public function update(Request $request, $id)
{
    $user = User::findOrFail($id);

    // Validate dữ liệu
    $request->validate([
        'username' => 'required|string|max:255',
        'email' => 'required|email',
        'password' => 'nullable|string|min:8|confirmed',
        'avatar' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
    ]);

    // Cập nhật thông tin người dùng
    $user->username = $request->input('username');
    $user->email = $request->input('email');

    if ($request->filled('password')) {
        $user->password = bcrypt($request->input('password'));
    }

    // Nếu có avatar, xử lý upload
    if ($request->hasFile('avatar')) {
        $avatarPath = $request->file('avatar')->store('images/avt', 'public');
        $user->avatar = $avatarPath;
    }

    $user->save();

    return response()->json(['message' => 'User updated successfully'], 200);
}


public function status($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->status = !$user->status;
    $user->save();

    return response()->json(['message' => 'User status updated', 'status' => $user->status]);
}

public function delete($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->status = 0; // Giả định là 0 nghĩa là "đã xóa mềm"
    $user->save();

    return response()->json(['message' => 'User deleted successfully']);
}

public function restore($id)
{
    $user = User::withTrashed()->find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->status = 1; // Khôi phục trạng thái
    $user->save();

    return response()->json(['message' => 'User restored successfully']);
}

public function destroy($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->delete();

    return response()->json(['message' => 'User permanently deleted']);
}

}
