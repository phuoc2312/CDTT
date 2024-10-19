import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './../src/components/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/product/product';
import Categories from './pages/category/categories';
import Orders from './pages/order/order';
import Users from './pages/user/user';
import RegisterAdmin from './pages/register/registeradmin';
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
import Post from './pages/post/post'
import Addpost from './pages/post/Addpost';
import EditPost from './pages/post/EditPost';
function App() {
    // Trạng thái mở/đóng Sidebar
    const [isOpen, setIsOpen] = useState(false);

    // Hàm để toggle Sidebar
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Router>
            <div className="flex">
                {/* Nút để mở/đóng Sidebar trên thiết bị nhỏ */}
                <button
                    className="md:hidden p-4"
                    onClick={toggleSidebar}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        ></path>
                    </svg>
                </button>

                {/* Sidebar với trạng thái mở/đóng */}
                <Sidebar isOpen={isOpen} />

                {/* Nội dung chính */}
                <div className="flex-1 ml-64 p-4">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
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
                        <Route path="/user" element={<Users />} />
                        <Route path="/admin/register" element={<RegisterAdmin />} />

                        <Route path="/banner" element={<Banner />} />
                        <Route path="/banner/add" element={<AddBanner />} />
                        <Route path="/banner/edit/:id" element={<EditBanner />} />

                        <Route path="/config" element={<Config />} />

                        <Route path="/bin" element={<RecycleBin />} />

                        <Route path="/topic" element={<Topic />} />
                        <Route path="/topic/add" element={<AddTopic />} />
                        <Route path="/topic/edit/:id" element={<EditTopic />} />

                        <Route path="/post" element={<Post />} />
                        <Route path="/post/add" element={<Addpost />} />
                        <Route path="/post/edit/:id" element={<EditPost />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
