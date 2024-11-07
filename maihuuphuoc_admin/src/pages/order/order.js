import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import OrderService from '../../Service/OrderService';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getList();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        setError("Có lỗi xảy ra khi tải danh sách đơn hàng");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn chuyển đơn hàng này vào thùng rác không?")) {
      try {
        // Cập nhật trạng thái của đơn hàng thành 2
        await OrderService.delete(id, 2);
        
        // Cập nhật danh sách đơn hàng bằng cách lọc đơn hàng đã xóa
        setOrders(prevOrders => prevOrders.filter(order => order.id !== id));

      } catch (error) {
        alert("Có lỗi xảy ra khi chuyển đơn hàng vào thùng rác");
      }
    }
  };
  
  if (loading) return <p className="text-center text-gray-500">Đang tải...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Quản lý Đơn hàng</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left font-semibold">Order ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left font-semibold">Tên Người dùng</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left font-semibold">SĐT</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left font-semibold">Địa chỉ</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left font-semibold">Trạng thái</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{order.id}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{order.name}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{order.phone}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{order.address}</td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${order.status === 1
                        ? 'bg-yellow-200 text-yellow-800'     // Chưa xử lý
                        : order.status === 0
                          ? 'bg-green-200 text-green-800'     // Đã xử lý
                          : order.status === 3
                            ? 'bg-red-200 text-red-800'       // Đơn hàng đã hủy
                            : 'bg-blue-200 text-blue-800'     // Đã giao
                      }`}
                  >
                    {order.status === 1
                      ? "Chưa xử lý"
                      : order.status === 0
                        ? "Đã xử lý"
                        : order.status === 3
                          ? "Đơn hàng đã hủy"
                          : "Đã giao"}
                  </span>
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-gray-800 flex space-x-4">
                  <Link
                    to={`/order/${order.id}`}
                    className="text-blue-500 hover:text-blue-700 transition duration-200"
                    title="Chỉnh sửa"
                  >
                    <FaEdit />
                  </Link>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                    title="Xóa"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
