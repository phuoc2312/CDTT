import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/styles.css';
import CategoryService from '../Service/CategoryService';
import BrandService from '../Service/BrandService';
import CartService from '../Service/CartService';
import { ApiImages } from '../Api/ApiImages';

function Header() {
    const [cartItems, setCartItems] = useState([]); // Trạng thái để lưu trữ sản phẩm trong giỏ hàng
    const [isHovered, setIsHovered] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isBrandOpen, setIsBrandOpen] = useState(false);
    const [username, setUsername] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [formData, setFormData] = useState({
        category_id: '',
        brand_id: ''
    });
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUsername = localStorage.getItem('name');
        console.log(localStorage.getItem('name'))
        if (token && storedUsername) {
            setUsername(storedUsername);
        } else {
            setUsername(null);
        }
    }, []);

    useEffect(() => {
        const fetchCategoriesAndBrands = async () => {
            try {
                const categoriesResponse = await CategoryService.getList(); // Lấy danh mục
                setCategories(categoriesResponse.categories);

                const brandsResponse = await BrandService.getList(); // Lấy thương hiệu
                setBrands(brandsResponse.brands);
            } catch (err) {
                console.error('Lỗi khi lấy danh mục hoặc thương hiệu:', err);
            }
        };
        fetchCategoriesAndBrands();
    }, []);
    useEffect(() => {
        const fetchCartItems = async () => {
            const userId = localStorage.getItem('userId'); // Lấy userId từ Local Storage
            if (userId) {
                try {
                    const response = await CartService.getList(userId); // Gọi API với userId
                    if (response.status && response.cart.length > 0) {
                        setCartItems(response.cart); // Đặt cartItems từ phản hồi
                    } else {
                        console.log("No cart items found or error in response:", response);
                        setCartItems([]); // Đặt cartItems thành rỗng
                    }
                } catch (error) {
                    console.error("Error fetching cart items:", error);
                    setCartItems([]); // Đặt cartItems thành rỗng nếu có lỗi
                }
            } else {
                console.log("User ID not found in Local Storage.");
            }
        };

        fetchCartItems();
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        setUsername(null);                    // Set trạng thái username về null
        navigate('/login');                   // Điều hướng về trang đăng nhập
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const toggleCategoryDropdown = () => {
        setIsCategoryOpen((prev) => !prev);
        if (isBrandOpen) setIsBrandOpen(false); // Đóng dropdown thương hiệu
    };

    const toggleBrandDropdown = () => {
        setIsBrandOpen((prev) => !prev);
        if (isCategoryOpen) setIsCategoryOpen(false); // Đóng dropdown danh mục
    };

    const handleCategorySelect = (categoryId) => {
        setFormData({ ...formData, category_id: categoryId });
        setIsCategoryOpen(false);
        navigate(`/products/category?category_id=${categoryId}`); // Điều hướng đến danh sách sản phẩm theo danh mục
    };

    const handleBrandSelect = (brandId) => {
        setFormData({ ...formData, brand_id: brandId });
        setIsBrandOpen(false);
        navigate(`/products/brand?brand_id=${brandId}`); // Điều hướng đến danh sách sản phẩm theo thương hiệu
    };

    return (
        <header className="bg-gray-dark sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-4">
                {/* Left section: Logo */}
                <Link to="/" className="flex items-center">
                    <div>
                        <img src="/assets/images/template-white-logo.png" alt="Logo" className="h-14 w-auto mr-4" />
                    </div>
                </Link>

                {/* Hamburger menu (for mobile) */}
                <div className="flex lg:hidden">
                    <button id="hamburger" className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>

                {/* Center section: Menu */}
                <nav className="hidden lg:flex md:flex-grow justify-center">
                    <ul className="flex justify-center space-x-4 text-white">
                        <li><Link to="/" className="hover:text-secondary font-semibold">Home</Link></li>

                        <li className="relative">
                            <button onClick={toggleCategoryDropdown} className="hover:text-secondary font-semibold flex items-center">
                                Category
                                <i className={`fas fa-chevron-down ml-1 text-xs ${isCategoryOpen ? 'rotate-180' : ''}`}></i>
                            </button>
                            {isCategoryOpen && (
                                <ul className="absolute bg-gray-800 border border-gray-600 mt-1 rounded-md z-10 shadow-lg">
                                    {categories.map((category) => (
                                        <li key={category.id} onClick={() => handleCategorySelect(category.id)} className="p-2 text-gray-200 hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                                            {category.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        <li className="relative">
                            <button onClick={toggleBrandDropdown} className="hover:text-secondary font-semibold flex items-center">
                                Brand
                                <i className={`fas fa-chevron-down ml-1 text-xs ${isBrandOpen ? 'rotate-180' : ''}`}></i>
                            </button>
                            {isBrandOpen && (
                                <ul className="absolute bg-gray-800 border border-gray-600 mt-1 rounded-md z-10 shadow-lg">
                                    {brands.map((brand) => (
                                        <li key={brand.id} onClick={() => handleBrandSelect(brand.id)} className="p-2 text-gray-200 hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                                            {brand.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        <li><Link to="/product" className="hover:text-secondary font-semibold">Product</Link></li>
                        <li><Link to="/blog" className="hover:text-secondary font-semibold">Blogs</Link></li>
                        <li><Link to="/contact" className="hover:text-secondary font-semibold">Contacts</Link></li>
                    </ul>
                </nav>

                {/* Right section: Buttons (for desktop) */}
                <div className="hidden lg:flex items-center space-x-4 relative">
                    {username ? (
                        <div className="flex items-center space-x-4">
                            {/* Hiển thị Username */}
                            <span className="text-white font-semibold">Hello,👋 {username}</span>

                            {/* Nút Logout */}
                            <button
                                className="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary py-2 px-4 rounded-full"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <span className="text-gray-600">
                            <Link to="/login" className="bg-primary border border-primary hover:bg-transparent text-white hover:text-primary font-semibold px-4 py-2 rounded-full inline-block">Login</Link>
                            <Link to="/register" className="bg-primary border border-primary hover:bg-transparent text-white hover:text-primary font-semibold px-4 py-2 rounded-full inline-block ml-4">Register</Link>
                        </span>
                    )}

                    <div
                        className="relative group cart-wrapper"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <Link to="/cart" className="relative">
                            <img src="/assets/images/cart-shopping.svg" alt="Cart" className="h-6 w-6 group-hover:scale-120" />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                                    {cartItems.length} {/* Tổng số đơn hàng */}
                                </span>
                            )}
                        </Link>
                        {/* Cart dropdown */}
                        {isHovered && (
                            <div className="absolute right-0 mt-1 w-80 bg-white shadow-lg p-4 rounded">
                                <div className="space-y-4">
                                    {cartItems.length > 0 ? (
                                        cartItems.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-line">
                                                <div className="flex items-center">
                                                    <img
                                                        src={`${ApiImages}/images/product/${item.thumbnail}`}
                                                        alt={item.name}
                                                        className="w-16 h-16 lg:w-32 lg:h-32 object-contain mb-4 rounded-md"
                                                    />
                                                    <div>
                                                        <p className="font-semibold">{item.name}</p>
                                                        <p className="text-sm">Quantity: {item.qty}</p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold">${item.priceroot * item.qty}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center">Giỏ hàng trống</p>
                                    )}
                                </div>
                                <Link
                                    to="/cart"
                                    className="block text-center mt-4 border border-primary bg-primary hover:bg-transparent text-white hover:text-primary py-2 rounded-full font-semibold"
                                >
                                    Go to Cart
                                </Link>
                            </div>
                        )}
                    </div>


                    <a id="search-icon" href="javascript:void(0);" className="text-white hover:text-secondary group">
                        <img src="/assets/images/search-icon.svg" alt="Search" className="h-6 w-6 transition-transform transform group-hover:scale-120" />
                    </a>

                    {/* Search field */}
                    <div id="search-field" className="hidden absolute top-full right-0 mt-2 w-full bg-white shadow-lg p-2 rounded">
                        <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Search for products..." />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
