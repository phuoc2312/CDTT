<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('status', '!=', 2)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "slug", "thumbnail", "description", "parent_id", "status")
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'categories' => $categories
        ]);
    }

    public function trash()
    {
        $categories = Category::where('status', '=', 2)
            ->orderBy('sort_order', 'ASC')
            ->select("id", "name", "slug", "thumbnail", "description", "parent_id", "status")
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'categories' => $categories
        ]);
    }

    public function show($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'category' => null
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Tải dữ liệu thành công',
            'category' => $category
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = new Category();
        $this->setCategoryAttributes($category, $request);

        if ($category->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Thêm thành công',
                'category' => $category
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Thêm thất bại',
            'category' => null
        ]);
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'category' => null
            ]);
        }

        $this->setCategoryAttributes($category, $request);
        $category->updated_at = now();

        if ($category->save()) {
            return response()->json([
                'status' => true,
                'message' => 'Sửa thành công',
                'category' => $category
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Sửa thất bại',
            'category' => null
        ]);
    }

    private function setCategoryAttributes($category, $request)
    {
        $category->name = $request->name;
        $category->slug = $request->slug;

        if ($request->hasFile('thumbnail')) {
            $this->handleThumbnailUpload($request, $category);
        }

        $category->description = $request->description;
        $category->sort_order = $request->sort_order;
        $category->parent_id = $request->parent_id ?? 0;
        $category->status = $request->status ?? 1;
        $category->created_by = 1; // Hoặc lấy từ auth
        $category->created_at = now();
    }

    private function handleThumbnailUpload($request, $category)
    {
        $allowedExtensions = ['jpg', 'png', 'webp', 'gif'];
        $extension = $request->thumbnail->extension();

        if (in_array($extension, $allowedExtensions)) {
            $thumbnailName = date('YmdHis') . "." . $extension;
            $request->thumbnail->move(public_path('images/category'), $thumbnailName);
            $category->thumbnail = $thumbnailName;
        }
    }

    public function delete($id)
    {
        $category = Category::find($id);
        if (!$category || $category->status != 1) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'category' => null
            ]);
        }

        $category->status = 2; // Đưa vào thùng rác
        $category->updated_at = now();
        $category->save();

        return response()->json([
            'status' => true,
            'message' => 'Dữ liệu đưa vào thùng rác thành công',
            'category' => $category
        ]);
    }

    public function restore($id)
    {
        // Tìm danh mục với ID và kiểm tra nếu status = 0 (đã xóa)
        $category = Category::find($id);

        // Kiểm tra nếu không tìm thấy danh mục hoặc trạng thái khác 0
        if (!$category || $category->status != 2) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu hoặc danh mục không ở trạng thái đã xóa.',
                'category' => null
            ]);
        }

        // Cập nhật trạng thái của danh mục để khôi phục
        $category->status = 1; // Khôi phục
        $category->updated_at = now(); // Cập nhật thời gian chỉnh sửa
        $category->save(); // Lưu thay đổi

        return response()->json([
            'status' => true,
            'message' => 'Khôi phục dữ liệu thành công.',
            'category' => $category
        ]);
    }


    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category || $category->status != 1) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu',
                'category' => null
            ]);
        }

        $category->status = 0;
        $category->updated_at = now();
        $category->save();

        return response()->json([
            'status' => true,
            'message' => 'Xóa dữ liệu thành công',
            'category' => $category
        ]);
    }
    public function updateStatus(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['status' => false, 'message' => 'Danh mục không tồn tại']);
        }

        // Chuyển đổi trạng thái mà không cần gửi lại thông tin trạng thái
        $category->status = $category->status === 1 ? 0 : 1; // Nếu đang bật (1), chuyển thành tắt (2) và ngược lại
        $category->updated_at = now(); // Cập nhật thời gian sửa đổi
        $category->save();

        return response()->json(['status' => true, 'message' => 'Cập nhật trạng thái thành công']);
    }
    public function forceDelete($id)
    {
        $category = Category::find($id);

        // Kiểm tra nếu không tìm thấy danh mục hoặc trạng thái không phải là 0 (đã xóa)
        if (!$category || $category->status != 2) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy dữ liệu hoặc danh mục không ở trạng thái thùng rác',
                'category' => null
            ]);
        }

        // Xóa vĩnh viễn danh mục khỏi cơ sở dữ liệu
        $category->delete(); // Sử dụng phương thức delete() để xóa vĩnh viễn

        return response()->json([
            'status' => true,
            'message' => 'Danh mục đã được xóa vĩnh viễn',
            'category' => null
        ]);
    }

}

