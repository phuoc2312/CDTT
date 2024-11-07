import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderService from '../../Service/OrderService';
import { ApiImages } from '../../Api/ApiImages';

const OrderDetail = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const data = await OrderService.show(id);
                console.log("Dữ liệu đơn hàng:", data); // Ghi lại dữ liệu đơn hàng để kiểm tra cấu trúc
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết đơn hàng:", error); // Ghi lại lỗi cụ thể
                setError("Có lỗi xảy ra khi tải thông tin đơn hàng");
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id]);

    const handleUpdateStatus = async (newStatus) => {
        try {
            await OrderService.updateStatus(id, newStatus); // Gọi API để cập nhật trạng thái đơn hàng
            setOrder(prevOrder => ({
                ...prevOrder,
                status: newStatus,
            }));
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
            setError("Có lỗi xảy ra khi cập nhật trạng thái");
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Chi tiết Đơn hàng #{order.id}</h1>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Thông tin Người dùng</h2>
                <p><strong>Tên:</strong> {order.name}</p>
                <p><strong>SĐT:</strong> {order.phone}</p>
                <p><strong>Địa chỉ:</strong> {order.address}</p>
                <p><strong>Trạng thái:</strong> {order.status === 1 ? "Đã giao hàng" : order.status === 2 ? "Đã hủy" : "Chưa xác nhận"}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Chi tiết sản phẩm</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.order_details && Array.isArray(order.order_details) && order.order_details.length > 0 ? (
                        order.order_details.map(detail => (
                            <li key={detail.id} className="border p-4 rounded-lg shadow-md flex flex-col items-center">
                                <img
                                    src={`${ApiImages}/images/product/${detail.product.images[0].thumbnail}`} // Lấy thumbnail của sản phẩm
                                    alt={detail.product.name} // Thay đổi alt thành tên sản phẩm để thân thiện hơn
                                    className="w-16 h-16 lg:w-32 lg:h-32 object-contain mb-4 rounded-md"
                                />
                                <p><strong>Sản phẩm:</strong> {detail.product.name}</p> {/* Hiển thị tên sản phẩm */}
                                <p><strong>Số lượng:</strong> {detail.qty}</p>
                                <p><strong>Giá:</strong> {detail.price.toLocaleString()} VNĐ</p>
                                <p><strong>Tổng:</strong> {(detail.price * detail.qty).toLocaleString()} VNĐ</p>
                            </li>
                        ))
                    ) : (
                        <p>Không có chi tiết sản phẩm nào.</p>
                    )}
                </ul>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Hành động</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleUpdateStatus(0)}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                        Xác nhận đơn hàng
                    </button>

                    <button
                        onClick={() => handleUpdateStatus(3)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                        Hủy đơn hàng
                    </button>

                    <button
                        onClick={() => handleUpdateStatus(4)}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Đã giao hàng
                    </button>
                </div>

            </div>

            <div className="text-center mt-6">
                <Link to="/order" className="text-blue-500 hover:text-blue-700 underline">Quay lại danh sách đơn hàng</Link>
            </div>
        </div>
    );
};

export default OrderDetail;
