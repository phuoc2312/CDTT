// OrderEdit.jsx
import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const OrderEdit = () => {
  const { id } = useParams();
  const history = useHistory();
  const [order, setOrder] = useState({
    customerName: 'John Doe',
    total: 150,
    status: 'Pending',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prevOrder => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Order updated successfully!');
    history.push('/orders');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Order</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={order.customerName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
            <input
              type="number"
              name="total"
              value={order.total}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={order.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Shipped">Shipped</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderEdit;
