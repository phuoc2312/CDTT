import React from 'react';
import { FaGithub, FaTwitter } from 'react-icons/fa'; // Import icons từ react-icons
import imgg from '../../assets/images/main-slider/2.png'; // Import hình ảnh

function RegisterAdmin() {
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={imgg} // Hiển thị hình ảnh đúng cách
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src="../assets/images/login-office-dark.jpeg" // Đường dẫn hình ảnh này có thể cần chỉnh lại
              alt="Office"
            />
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Register
              </h1>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">Email</span>
                <input
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder="Enter your email"
                  type="email"
                />
              </label>
              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">Password</span>
                <input
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder="Enter your password"
                  type="password"
                />
              </label>

              <a
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                href="../index.html"
              >
                Register
              </a>

              <hr className="my-8" />

              {/* Nút login với Github */}
              <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-black transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray">
                <FaGithub className="w-4 h-4 mr-2" /> {/* Sử dụng icon Github */}
                Github
              </button>

              {/* Nút login với Twitter */}
              <button className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-black transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray">
                <FaTwitter className="w-4 h-4 mr-2" /> {/* Sử dụng icon Twitter */}
                Twitter
              </button>

              <p className="mt-4">
                {/* Bạn có thể thêm nội dung khác ở đây */}
              </p>
              <p className="mt-1">
                {/* Bạn có thể thêm nội dung khác ở đây */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterAdmin;
