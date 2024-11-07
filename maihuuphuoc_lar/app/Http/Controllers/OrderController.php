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
        // Retrieve orders where status is not equal to 2
        $orders = Order::where('status', '!=', 2)->get();

        // Check if the collection is empty
        if ($orders->isEmpty()) {
            return response()->json(['message' => 'Không có đơn hàng nào'], 200);
        }

        // Return the list of orders as JSON
        return response()->json($orders);
    }

    public function show($id)
    {
        // Lấy đơn hàng cùng với chi tiết và hình ảnh sản phẩm
        $order = Order::with(['orderDetails.product.images'])->findOrFail($id);

        return response()->json($order);
    }


    // Chuyển đơn hàng vào thùng rác
    public function trash()
    {
        $orders = Order::where('status', 2)
            ->select('id', 'name', 'phone', 'email', 'address', 'created_at', 'updated_at') // Include more fields as needed
            ->get();

        return response()->json($orders);
    }

    // Thay đổi trạng thái của đơn hàng
    public function status($id)
    {
        $order = Order::findOrFail($id);

        // Cập nhật trạng thái theo thứ tự: 1 -> 0 -> 3 -> 4 -> 1
        switch ($order->status) {
            case 1:
                $order->status = 0; // Đổi từ "Chưa xử lý" sang "Đã xử lý"
                break;
            case 0:
                $order->status = 3; // Đổi từ "Đã xử lý" sang "Đã hủy"
                break;
            case 3:
                $order->status = 4; // Đổi từ "Đã hủy" sang "Đã giao"
                break;
            case 4:
                $order->status = 1; // Đổi từ "Đã giao" sang "Chưa xử lý"
                break;
            default:
                $order->status = 1; // Mặc định về "Chưa xử lý" nếu trạng thái không nằm trong các giá trị trên
                break;
        }

        $order->save();

        return response()->json(['message' => 'Trạng thái đã được cập nhật', 'order' => $order]);
    }
    public function delete($id)
    {
        $order = Order::findOrFail($id);

        // Update the status to 2 to move it to trash
        $order->status = 2;
        $order->save();

        return response()->json(['message' => 'Đơn hàng đã được chuyển vào thùng rác', 'order' => $order]);
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


public function destroy($id)
{
    $order = Order::find($id);

    if ($order === null) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy dữ liệu',
            'post' => null
        ], 404);
    }

    try {
        // Xóa các chi tiết đơn hàng liên quan
        $order->details()->delete(); // Giả sử bạn đã định nghĩa mối quan hệ này trong model Order

        // Sau đó xóa đơn hàng
        $order->delete();
    } catch (\Exception $e) {
        // Log lỗi nếu có
        \Log::error('Lỗi khi xóa đơn hàng: ' . $e->getMessage());

        return response()->json([
            'status' => false,
            'message' => 'Lỗi khi xóa đơn hàng: ' . $e->getMessage(),
        ], 500);
    }

    return response()->json([
        'status' => true,
        'message' => 'Đơn hàng đã được xóa vĩnh viễn',
        'post' => $order
    ], 200);
}

    public function restore($id)
    {
        $order = Order::findOrFail($id);

        if ($order->status == 2) { // Chỉ khôi phục nếu trạng thái là 2 (đã xóa)
            $order->status = 1; // Đặt trạng thái về 1 (Chưa xử lý)
            $order->save();
            return response()->json(['message' => 'Đơn hàng đã được khôi phục', 'order' => $order], 200);
        }

        return response()->json(['message' => 'Không thể khôi phục đơn hàng này'], 400);
    }


}
