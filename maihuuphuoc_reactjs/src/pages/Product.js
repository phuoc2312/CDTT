import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../Service/ProductService';
import Header from '../components/header';
import Footer from '../components/footer';
import CategoryService from '../Service/CategoryService';
import BrandService from '../Service/BrandService';
import CartService from '../Service/CartService';

function Product() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [priceAlert, setPriceAlert] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResult = await ProductService.getList();
                setProducts(productResult.products || []);
                setFilteredProducts(productResult.products || []);

                const categoriesResponse = await CategoryService.getList();
                setCategories([{ id: 'all', name: 'Tất cả danh mục' }, ...(categoriesResponse.categories || [])]);

                const brandsResponse = await BrandService.getList();
                setBrands([{ id: 'all', name: 'Tất cả thương hiệu' }, ...(brandsResponse.brands || [])]);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = products;

        // Kiểm tra nếu không chọn hoặc chọn "Tất cả danh mục"
        if (selectedCategories.length > 0 && !selectedCategories.includes('all')) {
            filtered = filtered.filter(product =>
                selectedCategories.includes(String(product.category_id))
            );
        }

        // Kiểm tra nếu không chọn hoặc chọn "Tất cả thương hiệu"
        if (selectedBrands.length > 0 && !selectedBrands.includes('all')) {
            filtered = filtered.filter(product =>
                selectedBrands.includes(String(product.brand_id))
            );
        }

        // Lọc sản phẩm theo khoảng giá chỉ khi có giá trị nhập
        if (minPrice !== '' && maxPrice !== '') {
            filtered = filtered.filter(product => product.pricebuy >= minPrice && product.pricebuy <= maxPrice);
        }

        setFilteredProducts(filtered);
    }, [selectedCategories, selectedBrands, minPrice, maxPrice, products]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;

        if (value === 'all') {
            setSelectedCategories(['all']); // Chọn tất cả
        } else {
            setSelectedCategories((prev) =>
                prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]
            );
            setSelectedCategories((prev) => prev.filter((id) => id !== 'all')); // Bỏ chọn "Tất cả" nếu chọn khác
        }
        setCurrentPage(1);
    };

    const handleBrandChange = (e) => {
        const value = e.target.value;

        if (value === 'all') {
            setSelectedBrands(['all']); // Chọn tất cả
        } else {
            setSelectedBrands((prev) =>
                prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]
            );
            setSelectedBrands((prev) => prev.filter((id) => id !== 'all')); // Bỏ chọn "Tất cả" nếu chọn khác
        }
        setCurrentPage(1);
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;

        if (name === 'minPrice') {
            setMinPrice(value !== '' ? parseFloat(value) : ''); // Không đặt giá trị mặc định nếu người dùng không nhập
            if (value !== '' && parseFloat(value) > maxPrice) {
                setPriceAlert('Giá tối thiểu không thể lớn hơn giá tối đa!');
            } else {
                setPriceAlert('');
            }
        } else if (name === 'maxPrice') {
            setMaxPrice(value !== '' ? parseFloat(value) : ''); // Không đặt giá trị mặc định nếu người dùng không nhập
            if (value !== '' && parseFloat(value) < minPrice) {
                setPriceAlert('Giá tối đa không thể nhỏ hơn giá tối thiểu!');
            } else {
                setPriceAlert('');
            }
        }
        setCurrentPage(1);
    };

    const handleAddToCart = async (product) => {
        const quantity = 1; // Hoặc bạn có thể thêm logic để lấy số lượng từ input
        console.log(`Thêm ${quantity} sản phẩm vào giỏ hàng:`, product);

        // Lấy user_id từ localStorage
        const userId = localStorage.getItem('userId'); // Đảm bảo 'userId' là khóa đúng bạn đã lưu

        const cartItem = {
            user_id: userId, // Sử dụng userId từ localStorage
            product_id: product.id,
            qty: quantity
        };

        try {
            const response = await CartService.add(cartItem);
            console.log('Sản phẩm đã được thêm vào giỏ hàng:', response);
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error.response?.data || error.message);
        }
    };

    return (
        <div>
            <Header />
            <div className="mx-40 px-4 py-6 flex">
                <div className="w-80 bg-gray-100 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4 text-xl text-primary">Danh mục</h3>
                    {categories.length > 0 && categories.map((category) => (
                        <div key={category.id} className="mb-3">
                            <label className="flex items-center text-gray-700">
                                <input
                                    type="checkbox"
                                    value={category.id}
                                    checked={selectedCategories.includes(String(category.id))}
                                    onChange={handleCategoryChange}
                                    className="mr-3 accent-primary"
                                />
                                {category.name}
                            </label>
                        </div>
                    ))}

                    <h3 className="font-semibold mt-6 mb-4 text-xl text-primary">Thương hiệu</h3>
                    {brands.length > 0 && brands.map((brand) => (
                        <div key={brand.id} className="mb-3">
                            <label className="flex items-center text-gray-700">
                                <input
                                    type="checkbox"
                                    value={brand.id}
                                    checked={selectedBrands.includes(String(brand.id))}
                                    onChange={handleBrandChange}
                                    className="mr-3 accent-primary"
                                />
                                {brand.name}
                            </label>
                        </div>
                    ))}

                    <h3 className="font-semibold mt-6 mb-4 text-xl text-primary">Khoảng giá</h3>
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">Lọc theo giá</h3>
                        <div className="mb-2">
                            <input
                                type="number"
                                name="minPrice"
                                value={minPrice}
                                onChange={handlePriceChange}
                                placeholder="Giá tối thiểu"
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="number"
                                name="maxPrice"
                                value={maxPrice}
                                onChange={handlePriceChange}
                                placeholder="Giá tối đa"
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        {priceAlert && <p className="text-red-500">{priceAlert}</p>}
                    </div>
                </div>

                <div className="w-3/4">
                    <section id="latest-products">
                        <div className="container mx-auto px-4 ">
                            <div className="flex flex-wrap">
                                {currentProducts.length > 0 ? (
                                    currentProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="w-full sm:w-1/2 lg:w-1/4 p-4"
                                            onClick={() => handleProductClick(product.id)}
                                        >
                                            <div className="bg-white p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 h-full flex flex-col justify-between">
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    className="w-full h-56 object-cover mb-4 rounded"
                                                />
                                                <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                                                <p className="text-lg font-bold text-primary">${product.pricebuy.toLocaleString()}</p>
                                                <button
                                                    className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Ngăn chặn sự kiện click tới sản phẩm
                                                        handleAddToCart(product);
                                                    }}
                                                >
                                                    Thêm vào giỏ
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="w-full text-center">Không có sản phẩm nào.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Pagination */}
                     <div className="mt-8 flex justify-center space-x-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Product;
