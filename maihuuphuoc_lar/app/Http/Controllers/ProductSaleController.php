<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductSale;

class ProductSaleController extends Controller
{
    public function index()
    {
        $productSales = ProductSale::join('product', 'productsale.product_id', '=', 'product.id')
        ->join('productimage', 'productsale.product_id', '=', 'productimage.product_id')

        ->select(
            'productsale.id',
            'productsale.product_id',
            'product.name',
            'productsale.pricesale',
            'productsale.datebegin',
            'productsale.dateend',
            'productsale.created_at',
            'productsale.created_by',
            'productsale.updated_at',
            'productsale.updated_by',
            'productsale.status',
            'productimage.thumbnail'
        )
        ->where('product.status', '!=', 0)
        ->get();
        foreach ($productSales as $product) {
            $product->thumbnail = url('images/product/' . $product->thumbnail); // Thêm URL đầy đủ cho thumbnail
        }

        return response()->json($productSales, 200);
    }
    // Lấy thông tin của một sản phẩm giảm giá theo ID
    public function show($id)
    {
        $productSale = ProductSale::find($id);
        if ($productSale) {
            return response()->json($productSale, 200);
        } else {
            return response()->json(['message' => 'Product sale not found'], 404);
        }
    }

    // Cập nhật thông tin giảm giá của một sản phẩm
    public function update(Request $request, $id)
{
    $productSale = ProductSale::find($id);

    // Kiểm tra xem bản ghi có tồn tại không
    if ($productSale == null) {
        $result = [
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu',
            'productSale' => null
        ];
    } else {
        // Cập nhật thông tin sản phẩm giảm giá

        $productSale->pricesale = $request->pricesale;
        $productSale->datebegin = $request->datebegin;
        $productSale->dateend = $request->dateend;

        // Cập nhật thông tin trạng thái, người sửa, và thời gian sửa
        $productSale->updated_by = 1; // Bạn có thể thay đổi `updated_by` theo logic của bạn
        $productSale->updated_at = now();
        $productSale->status = 1;

        $check_save = false;

        // Lưu bản ghi
        if ($productSale->save()) {
            $result = [
                'status' => true,
                'message' => 'Sửa thành công',
                'productSale' => $productSale
            ];
        } else {
            $result = [
                'status' => false,
                'message' => 'Sửa thất bại',
                'productSale' => null
            ];
        }
    }

    return response()->json($result);

}
public function updatePsStatus(Request $request, $id)
{
    $productSale = ProductSale::find($id);


    if ($productSale == null) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu',
            'productSale' => null
        ]);
    }

    if (!in_array($request->status, [2, 1])) {
        return response()->json([
            'status' => false,
            'message' => 'Status chỉ nhận giá trị 1 hoặc 0',
            'productSale' => null
        ]);
    }

    $productSale->status = $request->status;
    $productSale->pricesale = 0;
    $productSale->datebegin =null;
    $productSale->dateend = null;
    $productSale->updated_at = now();


    if ($productSale->save()) {
        return response()->json([
            'status' => true,
            'message' => 'Sửa thành công',
            'productSale' => $productSale
        ]);
    } else {
        return response()->json([
            'status' => false,
            'message' => 'Sửa thất bại',
            'productSale' => null
        ]);
    }
}
}


