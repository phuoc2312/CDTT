// OrderManagement.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Header from '../../components/header';
const orders = [
  { id: 1, customerName: 'John Doe', total: 150, status: 'Pending' },
  { id: 2, customerName: 'Jane Smith', total: 200, status: 'Completed' },
  // Thêm dữ liệu giả ở đây hoặc lấy từ API
];

const OrderManagement = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Order Management</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="w-full border-b border-gray-200 bg-gray-400 text-white">
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Customer Name</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-b border-gray-200">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.customerName}</td>
              <td className="px-4 py-2">${order.total}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2 flex space-x-2">
                <Link to={`/orders/edit/${order.id}`} className="text-blue-600 hover:text-blue-800">
                  <FaEdit />
                </Link>
                <button
                  onClick={() => alert('Delete functionality not implemented')}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
