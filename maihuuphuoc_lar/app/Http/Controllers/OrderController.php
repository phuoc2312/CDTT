<?php

namespace App\Http\Controllers;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\OrderDetail;
use App\Models\ProductSale;

use App\Models\ProductStore;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:user,id',
            'product_id' => 'required|exists:product,id',
            'qty' => 'required|integer|min:1'
        ]);

        $productStore = ProductStore::where('product_id', $request->product_id)->first();
        $productSale = ProductSale::where('product_id', $request->product_id)->first();
        if (!$productStore || $productStore->qty < $request->qty) {
            return response()->json([
                'status' => false,
                'message' => 'Số lượng sản phẩm không đủ trong kho.'
            ], 400);
        }
        $order = new Order();
        $order->user_id = $request->input('user_id');
        $order->name = "phuocc";
        $order->phone = "0012345875";
        $order->email = "phuoc@gmail.com";
        $order->address = "Linh Trung, Thủ Đức";
        $order->status = 1;
        $order->created_at = now();
        $order->save();

        $orderDetail = new OrderDetail();
        $orderDetail->order_id = $order->id;
        $orderDetail->product_id = $request->input('product_id');
        $orderDetail->qty = $request->input('qty');
        $orderDetail->price = Product::find($request->input('product_id'))->pricebuy;
        $orderDetail->amount = ($orderDetail->price - $productSale->pricesale) * $orderDetail->qty;
        $orderDetail->discount = $productSale->pricesale  * $orderDetail->qty;
        $orderDetail->save();

        $productStore->qty -= $request->input('qty');
        $productStore->save();

        return response()->json([
            'status' => true,
            'message' => 'Đơn hàng đã được tạo thành công.',
            'order' => $order,
            'order_detail' => $orderDetail
        ]);
    }
}
