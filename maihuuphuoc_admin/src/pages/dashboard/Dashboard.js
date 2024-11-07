import React from 'react';
import { FaUsers, FaWallet, FaShoppingCart, FaComments } from 'react-icons/fa';
import Orders from '../../pages/order/order'; // Đảm bảo rằng Orders được xuất đúng cách từ file 'Order.js'
import Header from '../../components/header'; // Import Header component
import Menu from '../menu/Menu';

const Dashboard = () => {
  return (
    <>
      <Header /> {/* Sử dụng Header component */}
      <main className="h-full pb-16 overflow-y-auto dark:bg-gray-900">
        <div className="container px-6 mx-auto grid">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Dashboard
          </h2>
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            {/* Customers */}
            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
                <FaUsers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customers</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">300</p>
              </div>
            </div>
            {/* Revenue */}
            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
                <FaWallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">$6,430</p>
              </div>
            </div>
            {/* Orders */}
            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="p-3 mr-4 text-red-500 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-500">
                <FaShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Orders</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">45</p>
              </div>
            </div>
            {/* Comments */}
            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full dark:text-purple-100 dark:bg-purple-500">
                <FaComments className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">12</p>
              </div>
            </div>
          </div>
          {/* Additional content */}
          <Orders />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
