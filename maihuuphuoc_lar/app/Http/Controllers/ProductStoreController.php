<?php
namespace App\Http\Controllers;

use App\Models\ProductStore; // Model tương ứng
use Illuminate\Http\Request;

class ProductStoreController extends Controller
{
    // Lấy danh sách các sản phẩm
    public function index()
    {
        try {
            // Lấy sản phẩm kèm thông tin từ bảng product và productimage
            $products = ProductStore::join('product', 'productstore.product_id', '=', 'product.id')
                ->join('productimage', 'productstore.product_id', '=', 'productimage.product_id')
                ->select(
                    'productstore.*', // Lấy tất cả thông tin từ bảng productstore
                    'product.name',    // Lấy tên sản phẩm từ bảng product
                    'productimage.thumbnail' // Lấy hình ảnh từ bảng productimage
                )
                ->get();

            // Thêm URL đầy đủ cho hình ảnh thumbnail
            foreach ($products as $product) {
                $product->thumbnail = url('images/product/' . $product->thumbnail);
            }

            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Lấy danh sách sản phẩm đã bị xóa (soft deleted)
    public function trash()
    {
        try {
            $products = ProductStore::onlyTrashed()
                ->join('product', 'productstore.product_id', '=', 'product.id')
                ->join('productimage', 'productstore.product_id', '=', 'productimage.product_id')
                ->select(
                    'productstore.*',
                    'product.name',
                    'productimage.thumbnail'
                )
                ->get();

            foreach ($products as $product) {
                $product->thumbnail = url('images/product/' . $product->thumbnail);
            }

            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Hiển thị chi tiết một sản phẩm theo id
    public function show($id)
    {
        try {
            $product = ProductStore::join('product', 'productstore.product_id', '=', 'product.id')
                ->join('productimage', 'productstore.product_id', '=', 'productimage.product_id')
                ->select(
                    'productstore.*',
                    'product.name',
                    'productimage.thumbnail'
                )
                ->where('productstore.id', $id)
                ->firstOrFail();

            $product->thumbnail = url('images/product/' . $product->thumbnail);

            return response()->json($product);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    // Thêm mới một sản phẩm
    public function store(Request $request)
    {
        try {
            $product = ProductStore::create($request->all()); // Lưu sản phẩm mới
            return response()->json($product, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Cập nhật thông tin một sản phẩm theo id
    public function update(Request $request, $id)
    {
        try {
            // Tìm sản phẩm theo ID
            $product = ProductStore::findOrFail($id);

            // Cập nhật giá và số lượng từ request
            $product->priceroot = $request->input('priceroot');
            $product->qty = $request->input('qty');

            // Lưu thay đổi vào cơ sở dữ liệu
            $product->save();

            // Trả về thông tin sản phẩm sau khi cập nhật
            return response()->json($product);
        } catch (\Exception $e) {
            // Trả về lỗi nếu có bất kỳ vấn đề gì
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Thay đổi trạng thái của sản phẩm
    public function status($id)
    {
        try {
            $product = ProductStore::findOrFail($id);
            $product->status = !$product->status; // Chuyển đổi trạng thái
            $product->save();
            return response()->json($product);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Di chuyển sản phẩm vào thùng rác (soft delete)
    public function delete($id)
    {
        try {
            $product = ProductStore::findOrFail($id);
            $product->delete(); // Soft delete
            return response()->json(['message' => 'Product moved to trash']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Khôi phục sản phẩm từ thùng rác
    public function restore($id)
    {
        try {
            $product = ProductStore::onlyTrashed()->findOrFail($id);
            $product->restore(); // Khôi phục sản phẩm
            return response()->json(['message' => 'Product restored']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Xóa vĩnh viễn sản phẩm
    public function destroy($id)
    {
        try {
            $product = ProductStore::onlyTrashed()->findOrFail($id);
            $product->forceDelete(); // Xóa vĩnh viễn sản phẩm
            return response()->json(['message' => 'Product permanently deleted']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
