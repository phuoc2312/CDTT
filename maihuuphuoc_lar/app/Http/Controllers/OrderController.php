<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\OrderDetail;
use App\Models\Cart;
use App\Models\ProductStore; // Thêm mô hình ProductStore
use App\Models\ProductSale; // Thêm mô hình ProductSale

class OrderController extends Controller
{
    public function getCartItems($userId)
    {
        // Lấy sản phẩm từ giỏ hàng của người dùng
        return Cart::where('user_id', $userId)->get();
    }

    // Hiển thị danh sách đơn hàng
    public function index()
    {
        $orders = Order::all();

        if ($orders->isEmpty()) {
            return response()->json(['message' => 'Không có đơn hàng nào'], 200);
        }

        return response()->json($orders);
    }

    // Hiển thị chi tiết đơn hàng theo ID
    public function show($id)
    {
        $order = Order::findOrFail($id);
        return response()->json($order);
    }

    // Chuyển đơn hàng vào thùng rác
    public function trash()
    {
        $order = Order::where('status', 2)->get(); // Giả sử status = 2 là đã xóa
        return response()->json($order);
    }

    // Thay đổi trạng thái của đơn hàng
    public function status($id)
    {
        $order = Order::findOrFail($id);
        $order->status = !$order->status; // Đổi trạng thái từ 1 thành 0 hoặc ngược lại
        $order->save();
        return response()->json(['message' => 'Trạng thái đã được cập nhật', 'order' => $order]);
    }

    // Tạo mới đơn hàng
    // public function store(Request $request)
    // {
    //     $userId = $request->user_id; // ID người dùng từ yêu cầu

    //     // Lấy sản phẩm từ giỏ hàng
    //     $cartItems = $this->getCartItems($userId);

    //     if ($cartItems->isEmpty()) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Giỏ hàng của bạn trống.'
    //         ], 400);
    //     }

    //     $order = new Order();
    //     $order->user_id = $userId;
    //     $order->name = $request->input('name', 'Default Name');
    //     $order->phone = $request->input('phone', 'Default Phone');
    //     $order->email = $request->input('email', 'default@gmail.com');
    //     $order->address = $request->input('address', 'Default Address');
    //     $order->note = $request->input('note', ''); // Thêm trường ghi chú
    //     $order->updated_by = $request->input('updated_by', null); // Thêm trường người cập nhật
    //     $order->status = 1; // Trạng thái mặc định là 1 (đang xử lý)
    //     $order->save();

    //     // Lặp qua từng sản phẩm trong giỏ hàng để tạo chi tiết đơn hàng
    //     foreach ($cartItems as $cartItem) {
    //         $productStore = ProductStore::where('product_id', $cartItem->product_id)->first();
    //         $productSale = ProductSale::where('product_id', $cartItem->product_id)->first();

    //         if (!$productStore || $productStore->qty < $cartItem->qty) {
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'Số lượng sản phẩm không đủ trong kho cho sản phẩm ID ' . $cartItem->product_id
    //             ], 400);
    //         }

    //         // Tạo chi tiết đơn hàng
    //         $orderDetail = new OrderDetail();
    //         $orderDetail->order_id = $order->id;
    //         $orderDetail->product_id = $cartItem->product_id;
    //         $orderDetail->qty = $cartItem->qty;
    //         $orderDetail->price = Product::find($cartItem->product_id)->pricebuy;
    //         $orderDetail->amount = ($orderDetail->price - $productSale->pricesale) * $orderDetail->qty;
    //         $orderDetail->discount = $productSale->pricesale * $orderDetail->qty;
    //         $orderDetail->save();

    //         // Cập nhật lại số lượng sản phẩm trong kho
    //         $productStore->qty -= $cartItem->qty;
    //         $productStore->save();
    //     }

    //     // Có thể xóa sản phẩm khỏi giỏ hàng sau khi đã tạo đơn hàng
    //     Cart::where('user_id', $userId)->delete();

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'Đơn hàng đã được tạo thành công từ giỏ hàng.',
    //         'order' => $order
    //     ]);
    // }
public function store(Request $request)
{
    // Lấy ID người dùng từ yêu cầu
    $userId = $request->user_id;

    // Kiểm tra xem có sản phẩm nào trong đơn hàng không
    if (empty($request->items)) {
        return response()->json([
            'status' => false,
            'message' => 'Không có sản phẩm trong đơn hàng.'
        ], 400);
    }

    // Tạo đơn hàng mới
    $order = new Order();
    $order->user_id = $userId;
    $order->name = $request->input('name', 'Default Name');
    $order->phone = $request->input('phone', 'Default Phone');
    $order->email = $request->input('email', 'default@gmail.com');
    $order->address = $request->input('address', 'Default Address');
    $order->note = $request->input('note', ''); // Thêm trường ghi chú
    $order->status = 1; // Trạng thái mặc định là 1 (đang xử lý)
    $order->save();

    // Lặp qua từng sản phẩm trong items để tạo chi tiết đơn hàng
    foreach ($request->items as $item) {
        // Kiểm tra sản phẩm trong kho
        $productStore = ProductStore::where('product_id', $item['product_id'])->first();

        // Kiểm tra số lượng sản phẩm có đủ không
        if (!$productStore || $productStore->qty < $item['quantity']) {
            return response()->json([
                'status' => false,
                'message' => 'Số lượng sản phẩm không đủ trong kho cho sản phẩm ID ' . $item['product_id']
            ], 400);
        }

        // Tạo chi tiết đơn hàng
        $orderDetail = new OrderDetail();
        $orderDetail->order_id = $order->id;
        $orderDetail->product_id = $item['product_id'];
        $orderDetail->qty = $item['quantity'];
        $orderDetail->price = Product::find($item['product_id'])->pricebuy; // Giá mua của sản phẩm
        $orderDetail->amount = $orderDetail->price * $orderDetail->qty; // Tính tổng số tiền
        $orderDetail->discount = ($item['price'] ?? 0) * $orderDetail->qty; // Giảm giá (nếu có)
        $orderDetail->save();

        // Cập nhật lại số lượng sản phẩm trong kho
        $productStore->qty -= $item['quantity'];
        $productStore->save();
    }

    // Xóa sản phẩm theo từng đơn
    Cart::where('user_id', $userId)
            ->where('product_id', $item['product_id'])
            ->delete();

    return response()->json([
        'status' => true,
        'message' => 'Đơn hàng đã được tạo thành công từ giỏ hàng.',
        'order' => $order
    ]);
}


    // Xóa đơn hàng (di chuyển vào thùng rác)
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->status = 2; // Chuyển status = 2 để chỉ ra là đã xóa
        $order->save();

        return response()->json(['message' => 'Đơn hàng đã được chuyển vào thùng rác']);
    }
    // Cập nhật thông tin chi tiết đơn hàng
public function update(Request $request, $id)
{
    // Validate the incoming request data
    $request->validate([
        'qty' => 'required|integer|min:1',
        'price' => 'required|numeric',
        'discount' => 'nullable|numeric'
    ]);

    // Tìm chi tiết đơn hàng
    $orderDetail = OrderDetail::find($id);

    if (!$orderDetail) {
        return response()->json([
            'status' => false,
            'message' => 'Chi tiết đơn hàng không tồn tại.'
        ], 404);
    }

    // Cập nhật thông tin
    $orderDetail->qty = $request->qty;
    $orderDetail->price = $request->price;
    $orderDetail->amount = ($orderDetail->price * $orderDetail->qty) - ($request->discount ?? 0);
    $orderDetail->discount = $request->discount ?? $orderDetail->discount;
    $orderDetail->save();

    return response()->json([
        'status' => true,
        'message' => 'Chi tiết đơn hàng đã được cập nhật thành công.',
        'order_detail' => $orderDetail
    ], 200);
}
}
