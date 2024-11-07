import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './../src/components/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import Contact from './pages/Contact/Contact';
import Categories from './pages/category/categories';
import Orders from './pages/order/order';
import Users from './pages/user/user';

import Banner from './pages/banner/banner';
import Brand from './pages/brand/brand';
import AddBrand from './pages/brand/Addbrand';
import EditBrand from './pages/brand/editbrand';
import RecycleBin from './pages/bin/RecycleBin';
import Config from './pages/Config/config';
import AddBanner from './pages/banner/addbanner';
import EditBanner from './pages/banner/editbanner';
import Topic from './pages/topic/Topic';
import AddTopic from './pages/topic/AddTopic';
import EditTopic from './pages/topic/EditTopic';
import Product from './pages/product/product';
import ProductSale from './pages/productsale/ProductSale';
import EditProductSale from './pages/productsale/EditProductSale';
import ProductStore from './pages/productstore/ProductStore';
import EditProductStore from './pages/productstore/EditProductStore';
import AddProduct from './pages/product/Addproduct';
import EditProduct from './pages/product/Editproduct';
import Post from './pages/post/post';
import AddPost from './pages/post/Addpost';
import EditPost from './pages/post/EditPost';
import Login from './pages/auth/login';
import OrderDetail from './pages/order/OrderDetail';
import Menu from './pages/menu/Menu';
import AccountSettings from './pages/profile/AccountSettings';

function App() {
    // Trạng thái mở/đóng Sidebar và trạng thái đăng nhập
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Trạng thái xác thực người dùng

    // Kiểm tra nếu người dùng đã đăng nhập từ localStorage khi load lại trang
    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // Hàm để toggle Sidebar
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogin = () => {
        setIsAuthenticated(true); // Cập nhật trạng thái khi người dùng đăng nhập thành công
        localStorage.setItem('isAuthenticated', 'true'); // Lưu trạng thái đăng nhập vào localStorage
    };

    const handleLogout = () => {
        setIsAuthenticated(false); // Cập nhật trạng thái khi người dùng đăng xuất
        localStorage.removeItem('isAuthenticated'); // Xóa trạng thái đăng nhập khỏi localStorage
    };

    return (
        <Router>
            <div className="flex">
                <button className="md:hidden p-4" onClick={toggleSidebar}>
                    {/* SVG icon */}
                </button>

                {isAuthenticated && <Sidebar isOpen={isOpen} />}

                <div className="flex-1 ml-64 p-4">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
                            }
                        />
                        <Route
                            path="/login"
                            element={<Login onLogin={handleLogin} />}
                        />

                        {/* Các route khác sẽ yêu cầu người dùng phải đăng nhập */}
                        {isAuthenticated && (
                            <>
                                <Route path="/product" element={<Product />} />
                                <Route path="/product/add" element={<AddProduct />} />
                                <Route path="/product/edit/:id" element={<EditProduct />} />

                                <Route path="/productsale" element={<ProductSale />} />
                                <Route path="/productsale/edit/:id" element={<EditProductSale />} />

                                <Route path="/productstore" element={<ProductStore />} />
                                <Route path="/productstore/edit/:id" element={<EditProductStore />} />

                                <Route path="/categories" element={<Categories />} />
                                <Route path="/brand" element={<Brand />} />
                                <Route path="/brand/add" element={<AddBrand />} />
                                <Route path="/brand/edit/:id" element={<EditBrand />} />

                                <Route path="/order" element={<Orders />} />
                                <Route path="/order/:id" element={<OrderDetail />} />

                                <Route path="/user" element={<Users />} />
                            

                                <Route path="/banner" element={<Banner />} />
                                <Route path="/banner/add" element={<AddBanner />} />
                                <Route path="/banner/edit/:id" element={<EditBanner />} />

                                <Route path="/config" element={<Config />} />
                                <Route path="/bin" element={<RecycleBin />} />

                                <Route path="/topic" element={<Topic />} />
                                <Route path="/topic/add" element={<AddTopic />} />
                                <Route path="/topic/edit/:id" element={<EditTopic />} />

                                <Route path="/post" element={<Post />} />
                                <Route path="/post/add" element={<AddPost />} />
                                <Route path="/post/edit/:id" element={<EditPost />} />

                                <Route path="/menu" element={<Menu />} />

                                <Route path="/account-settings" element={<AccountSettings/>} />
                                <Route path="/contact" element={<Contact/>} />
                            </>
                        )}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
