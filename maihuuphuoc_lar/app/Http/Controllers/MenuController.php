<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use App\Http\Requests\StoreMenuRequest;

class MenuController extends Controller
{
    public function index()
    {
        $menu = Menu::where('status', '!=', 2)
            ->select("id", "name", "link", "type", "table_id","status")
            ->get();
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'menu' => $menu
        ]);
    }

    public function show($id)
    {
        $menu = Menu::find($id);
        if ($menu == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'menu' => null
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'menu' => $menu
        ]);
    }

    public function store(Request $request)
    {
        $menu = new Menu();
        $menu->name = $request->name;
        $menu->link = $request->link;
        $menu->type = $request->type;
        $menu->table_id = $request->table_id;
        $menu->created_by = 1; // Giả sử ID người tạo là 1
        $menu->created_at = now();
        $menu->status = $request->status;

        if ($menu->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Thêm thành công',
                'menu' => $menu
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không thể thêm',
                'menu' => null
            ]);
        }
    }
    public function update(Request $request, $id)
{
    // Tìm menu theo ID
    $menu = Menu::find($id);

    // Kiểm tra nếu menu không tồn tại
    if (!$menu) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy menu',
        ]);
    }

    // Cập nhật các trường thông tin
    $menu->name = $request->input('name', $menu->name); // Nếu không có giá trị từ request, giữ giá trị cũ
    $menu->link = $request->input('link', $menu->link);
    $menu->type = $request->input('type', $menu->type);

    // Cập nhật trạng thái: nếu status bằng 1 thì là hoạt động, nếu không thì là không hoạt động (0)
    $status = $request->input('status');
    $menu->status = ($status == 1) ? 1 : 0;  // Nếu status = 1 thì giữ 1, nếu không thì set thành 0

    // Lưu lại thay đổi vào cơ sở dữ liệu
    if ($menu->save()) {
        return response()->json([
            'status' => true,
            'message' => 'Cập nhật menu thành công',
            'menu' => $menu
        ]);
    }

    // Nếu không thể lưu, trả về lỗi
    return response()->json([
        'status' => false,
        'message' => 'Không thể cập nhật menu',
        'menu' => null
    ]);
}

public function updateStatus(Request $request, $id)
{
    // Tìm menu theo ID
    $menu = Menu::find($id);

    // Kiểm tra nếu menu không tồn tại
    if (!$menu) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy menu'
        ]);
    }

    // Cập nhật trạng thái từ request
    $status = $request->input('status');
    $menu->status = ($status == 1) ? 1 : 0; // Nếu status = 1 thì giữ 1, nếu không thì set thành 0

    // Cập nhật thời gian chỉnh sửa
    $menu->updated_at = now();

    // Lưu lại thay đổi vào cơ sở dữ liệu
    if ($menu->save()) {
        return response()->json([
            'status' => true,
            'message' => 'Cập nhật trạng thái thành công',
            'menu' => $menu
        ]);
    }

    // Nếu không thể lưu, trả về lỗi
    return response()->json([
        'status' => false,
        'message' => 'Không thể cập nhật trạng thái menu',
        'menu' => null
    ]);
}


    public function delete($id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'status' => false,
                'message' => 'Menu không tồn tại'
            ]);
        }

        $menu->status = 2; // Xóa bằng cách thay đổi trạng thái
        $menu->save();

        return response()->json([
            'status' => true,
            'message' => 'Menu đã được xóa tạm thời',
            'menu' => $menu
        ]);
    }
    public function restore($id)
    {
        $menu = Menu::find($id);
        if ($menu == null || $menu->status != 2) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'banner' => null
            ]);
        }

        $menu->status = 1;
        $menu->updated_by = 1;
        $menu->updated_at = now();
        $menu->save();

        return response()->json([
            'status' => true,
            'message' => 'Khôi phục dữ liệu thành công',
            'banner' => $menu
        ]);
    }

    public function destroy($id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'status' => false,
                'message' => 'Menu không tồn tại'
            ]);
        }

        // Xóa vĩnh viễn menu
        $menu->delete();

        return response()->json([
            'status' => true,
            'message' => 'Menu đã được xóa vĩnh viễn'
        ]);
    }
    public function trash()
    {
        $banners = Menu::where('status', '=', 2) // Lấy banner ở trạng thái thùng rác
        ->select("id", "name", "link", "type", "table_id","status")
        ->get();
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'banners' => $banners
        ]);
    }

}
