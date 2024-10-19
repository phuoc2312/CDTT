<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::where('status', '!=', 2) // Chỉ lấy banner không ở trạng thái thùng rác
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "image", "status", "position", "description","link")
            ->get();
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'banners' => $banners
        ]);
    }

    public function trash()
    {
        $banners = Banner::where('status', '=', 2) // Lấy banner ở trạng thái thùng rác
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "image", "status", "position", "description")
            ->get();
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'banners' => $banners
        ]);
    }

    public function show($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'banner' => null
            ]);
        }
        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'banner' => $banner
        ]);
    }

    public function store(StoreBannerRequest $request)
    {
        $banner = new Banner();
        $banner->name = $request->name;
        $banner->link = $request->link;
        $banner->description = $request->description;
        $banner->position = $request->position ?? 'slideshow';
        $banner->sort_order = $request->sort_order;
        $banner->created_by = 1;
        $banner->created_at = now();
        $banner->status = $request->status; // Trạng thái được truyền từ yêu cầu

        // Xử lý hình ảnh
        if ($request->hasFile('image')) {
            $validatedImage = $request->validate([
                'image' => 'image|mimes:jpg,png,webp,gif|max:2048',
            ]);
            $imageName = time() . '.' . $validatedImage['image']->extension();
            $validatedImage['image']->move(public_path('images/banner'), $imageName);
            $banner->image = $imageName;
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Chưa chọn hình ảnh',
                'banner' => null
            ]);
        }

        if ($banner->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Thêm thành công',
                'banner' => $banner
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không thể thêm',
                'banner' => null
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'link' => 'required|url',
            'description' => 'required|string',
            'position' => 'required|string',
            'sort_order' => 'required|integer',
            'image' => 'nullable|image|mimes:jpg,png,webp,gif|max:2048',
        ]);

        $banner->name = $validatedData['name'];
        $banner->link = $validatedData['link'];
        $banner->description = $validatedData['description'];
        $banner->position = $validatedData['position'];
        $banner->sort_order = $validatedData['sort_order'];

        if ($request->hasFile('image')) {
            if ($banner->image) {
                Storage::delete('public/images/banner/' . $banner->image);
            }
            $imageName = time() . '.' . $request->file('image')->extension();
            $request->file('image')->move(public_path('images/banner'), $imageName);
            $banner->image = $imageName;
        }

        $banner->save();

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật thành công',
            'banner' => $banner
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $banner = Banner::find($id);
        if (!$banner) {
            return response()->json(['status' => false, 'message' => 'Banner không tồn tại']);
        }

        // Chuyển đổi trạng thái: bật (1) hoặc tắt (0)
        $banner->status = $banner->status === 1 ? 0 : 1; // Chuyển đổi trạng thái
        $banner->updated_at = now();
        $banner->save();

        return response()->json(['status' => true, 'message' => 'Cập nhật trạng thái thành công']);
    }

    public function destroy($id)
    {
        $banner = Banner::find($id);
        if ($banner == null || $banner->status != 1) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu hoặc banner không ở trạng thái hoạt động',
                'banner' => null
            ]);
        }

        // Đặt trạng thái thành 2 để vào thùng rác
        $banner->status = 2;
        $banner->updated_by = 1;
        $banner->updated_at = now();
        $banner->save();

        return response()->json([
            'status' => true,
            'message' => 'Banner đã được chuyển vào thùng rác',
            'banner' => $banner
        ]);
    }

    public function restore($id)
    {
        $banner = Banner::find($id);
        if ($banner == null || $banner->status != 2) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'banner' => null
            ]);
        }

        $banner->status = 1;
        $banner->updated_by = 1;
        $banner->updated_at = now();
        $banner->save();

        return response()->json([
            'status' => true,
            'message' => 'Khôi phục dữ liệu thành công',
            'banner' => $banner
        ]);
    }
    public function forceDelete($id)
{
    $banner = Banner::find($id);
    if ($banner == null || $banner->status != 2) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu hoặc banner không ở trạng thái thùng rác',
            'banner' => null
        ]);
    }

    // Xóa hình ảnh khỏi hệ thống lưu trữ nếu có
    if ($banner->image) {
        Storage::delete('public/images/banner/' . $banner->image);
    }

    // Xóa vĩnh viễn banner khỏi cơ sở dữ liệu
    $banner->delete();

    return response()->json([
        'status' => true,
        'message' => 'Banner đã được xóa vĩnh viễn',
        'banner' => null
    ]);
}

}
