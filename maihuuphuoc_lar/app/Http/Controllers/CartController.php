<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;

class CartController extends Controller
{
    // Thêm sản phẩm vào giỏ hàng
    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'user_id' => 'required|exists:user,id',
            'product_id' => 'required|exists:product,id',
            'qty' => 'required|integer|min:1'
        ]);

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        $cartItem = Cart::where('user_id', $request->user_id)
                        ->where('product_id', $request->product_id)
                        ->first();

        if ($cartItem) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            $cartItem->qty += $request->qty;
            $cartItem->save();
        } else {
            // Nếu chưa, thêm sản phẩm mới vào giỏ hàng
            Cart::create([
                'user_id' => $request->user_id,
                'product_id' => $request->product_id,
                'qty' => $request->qty
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Sản phẩm đã được thêm vào giỏ hàng thành công.'
        ], 201);
    }

// Hiển thị giỏ hàng của một người dùng
public function showCart($user_id)
{
    // Sử dụng join để lấy thêm thông tin sản phẩm
    $cartItems = Cart::where('user_id', $user_id)
        ->join('product', 'cart.product_id', '=', 'product.id')
        ->join('productimage', 'product.id', '=', 'productimage.product_id')
        ->join('productstore', 'product.id', '=', 'productstore.product_id')
        ->join('productsale', 'product.id', '=', 'productsale.product_id')
        ->select(
            'cart.*', // Lấy tất cả các trường từ bảng cart
            'product.name as product_name',
            'product.slug as product_slug',
            'productimage.thumbnail',
            'productstore.priceroot',
            'productsale.pricesale',
            'product.pricebuy' // Thêm cột giá mua từ bảng product
        )
        ->get();

    if ($cartItems->isEmpty()) {
        return response()->json([
            'status' => false,
            'message' => 'Giỏ hàng trống.'
        ], 404);
    }

    return response()->json([
        'status' => true,
        'cart' => $cartItems
    ], 200);
}

public function update(Request $request, $id)
{
    // Validate the incoming request data
    $request->validate([
        'qty' => 'required|integer|min:1'
    ]);

    // Tìm sản phẩm trong giỏ hàng
    $cartItem = Cart::find($id);

    if (!$cartItem) {
        return response()->json([
            'status' => false,
            'message' => 'Sản phẩm không tồn tại trong giỏ hàng.'
        ], 404);
    }

    // Cập nhật số lượng sản phẩm
    $cartItem->qty = $request->qty;
    $cartItem->save();

    return response()->json([
        'status' => true,
        'message' => 'Số lượng sản phẩm đã được cập nhật thành công.'
    ], 200);
}

    public function destroy($id)
    {
        // Tìm sản phẩm trong giỏ hàng
        $cartItem = Cart::find($id);

        if (!$cartItem) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không tồn tại trong giỏ hàng.'
            ], 404);
        }

        // Xóa sản phẩm
        $cartItem->delete();

        return response()->json([
            'status' => true,
            'message' => 'Sản phẩm đã được xóa thành công.'
        ], 200);
    }


}
