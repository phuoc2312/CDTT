import React, { useState } from 'react';

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* Mobile hamburger */}
        <button className="p-2 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple" aria-label="Menu">
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
          </svg>
        </button>
        {/* Search input */}
        <div className="flex flex-1 justify-center lg:mr-32">
          <div className="relative w-full max-w-lg">
            <input className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border rounded-md dark:placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:shadow-outline-purple" type="text" placeholder="Search for projects" aria-label="Search" />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
        <ul className="flex items-center space-x-6">
          {/* Theme toggler */}
          <li>
            <button className="p-2 rounded-md focus:outline-none focus:shadow-outline-purple" aria-label="Toggle color mode">
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>
          </li>
          {/* Notifications menu */}
          <li className="relative">
            <button className="p-2 rounded-md focus:outline-none focus:shadow-outline-purple" aria-label="Notifications" aria-haspopup="true" onClick={toggleNotifications}>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
              </svg>
              <span aria-hidden="true" className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"></span>
            </button>
            {/* Notifications dropdown */}
            {isNotificationsOpen && (
              <ul className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700" aria-label="submenu">
                <li className="flex">
                  <a className="flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                    <span>Messages</span>
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">
                      13
                    </span>
                  </a>
                </li>
                <li className="flex">
                  <a className="flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                    <span>Order</span>
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">
                      2
                    </span>
                  </a>
                </li>
              </ul>
            )}
          </li>
          {/* Profile menu */}
          <li className="relative">
            <button className="p-1 rounded-full focus:shadow-outline-purple focus:outline-none" aria-label="Account" aria-haspopup="true" onClick={toggleProfileMenu}>
              <img className="object-cover w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=200&amp;fit=max&amp;s=aa3a807e1bbdfd4364d1f449eaa96d82" alt="Profile" aria-hidden="true" />
            </button>
            {/* Profile dropdown */}
            {isProfileMenuOpen && (
              <ul className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700" aria-label="submenu">
                <li className="flex">
                  <a className="flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                    <svg className="w-4 h-4 mr-3" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <span>Account settings</span>
                  </a>
                </li>
                <li className="flex">
                  <a className="flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                    <svg className="w-4 h-4 mr-3" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17 10l4.5 4.5L17 19M7 19l-4.5-4.5L7 10" />
                    </svg>
                    <span>Logout</span>
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
