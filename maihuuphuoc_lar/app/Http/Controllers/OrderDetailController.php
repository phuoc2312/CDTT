<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use Illuminate\Http\Request;

class OrderDetailController extends Controller
{
    // Hiển thị chi tiết đơn hàng theo ID đơn hàng
    public function show($orderId)
    {
        $orderDetails = OrderDetail::where('order_id', $orderId)->get();
        return response()->json($orderDetails);
    }

    // Xóa chi tiết đơn hàng
    public function destroy($id)
    {
        $orderDetail = OrderDetail::findOrFail($id);
        $orderDetail->delete();

        return response()->json(['message' => 'Chi tiết đơn hàng đã được xóa']);
    }
}
