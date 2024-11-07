import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/template-logo.png';

const Sidebar = () => {
  return (
    <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0  ">
      <div className="py-4 text-gray-500 dark:text-gray-400">
        <img src={logo} alt="Logo" className="h-8 w-auto ml-12 w-40 h-16" />
        <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
          MAI HUW PHUOC</a>
        <ul className="mt-6">
          <li className="relative px-6 py-3">
            <span className="absolute inset-y-0 left-0 w-1 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
            <Link to="/" className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span className="ml-4">Dashboard</span>
            </Link>
          </li>
        </ul>
        <ul >
          <li className="relative px-6 py-3">
            <span className="absolute inset-y-0 left-0 w-1  rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
            <Link to="/menu" className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
              <span className="ml-4">Menu</span>
            </Link>
          </li>
        </ul>
        <ul >
          <li className="relative px-6 py-3">
            <Link to="/categories" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
              </svg>
              <span className="ml-4">Category</span>
            </Link>
          </li>
          <li className="relative px-6 py-3">
            <Link to="/product" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span className="ml-4">Product</span>
            </Link>
          </li>
          <li className="relative px-6 py-3">
            <Link to="/productsale" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span className="ml-4">ProductSale</span>
            </Link>
          </li>
          <li className="relative px-6 py-3">
            <Link to="/productstore" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span className="ml-4">ProductStore</span>
            </Link>
          </li>
          <li className="relative px-6 py-3">
            <Link to="/order" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <span className="ml-4">Order</span>
            </Link>
          </li>
          <li className="relative px-6 py-3">
            <Link to="/banner" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {/* Icon that resembles a banner with a management touch */}
                <path
                  d="M3 4h18v6H3z"  /* Main banner shape */
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 10l9 4 9-4"  /* Middle management line */
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="18"
                  r="2" /* Circle element to indicate a setting or option */
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="ml-4">Banner</span>
            </Link>
          </li>
          <li className="relative px-6 py-3">
            <Link to="/brand" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v8.27a4 4 0 0 0 1.45 2.74L21 19" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="ml-4">Brand</span>
            </Link>
          </li>
          <li className="relative px-6 py-3">
            <Link to="/topic" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8l7.29 4.29a2 2 0 0 0 2.42 0L20 8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7" />
                <path d="M21 7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v.01" />
              </svg>
              <span className="ml-4">Topic</span>
            </Link>
          </li>
          <li className="relative px-6 py-3">
            <Link to="/post" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h18v18H3V3zm2 2v14h14V5H5z" />
                <path d="M9 8h6M9 12h6M9 16h6" />
              </svg>


              <span className="ml-4">Post</span>
            </Link>
          </li>
          <li className="relative px-6 py-3">
            <Link to="/config" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 10.5V7a2 2 0 012-2h2.57a6.978 6.978 0 00-.12 1.35c0 .217.018.431.052.642H5a2 2 0 00-2 2v3.5M19 10.5V7a2 2 0 00-2-2h-2.57a6.978 6.978 0 00.12 1.35c0 .217-.018.431-.052.642H19a2 2 0 012 2v3.5M12 14a2 2 0 100 4 2 2 0 000-4zm0-4a2 2 0 100 4 2 2 0 000-4zm6.364-4.636l1.414-1.414m0 0l-1.414-1.414m1.414 1.414l-1.414 1.414m-2.121 0l-1.414-1.414m2.121 2.121l1.414 1.414m0 0l-1.414 1.414m-2.121-2.121l-1.414 1.414m1.414-2.121L12 15"></path>
              </svg>
              <span className="ml-4">Config</span>
            </Link>
          </li>
          <li className="relative px-6 py-3">
            <Link to="/user" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M12 14c-4.418 0-8 3.582-8 8v1h16v-1c0-4.418-3.582-8-8-8zM12 12a4 4 0 100-8 4 4 0 000 8z" />
              </svg>

              <span className="ml-4">User</span>
            </Link>
          </li>
          <li className="relative px-6 py-3">
            <Link to="/bin" className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
              <svg className="w-5 h-5" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"></path>
              </svg>
              <span className="ml-4">RecycleBin</span>
            </Link>
          </li>
        </ul>

      </div>
    </aside>
  );
};

export default Sidebar;  