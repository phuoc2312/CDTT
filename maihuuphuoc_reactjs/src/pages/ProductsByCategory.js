import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductService from '../Service/ProductService';
import Footer from '../components/footer';
import Header from '../components/header';
import CartService from '../Service/CartService';

const ProductsByCategory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProducts = async () => {
            const queryParams = new URLSearchParams(location.search);
            const categoryId = queryParams.get('category_id');

            try {
                const response = await ProductService.getProductsByCategory(categoryId);
                setProducts(response.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false); // Đặt loading thành false sau khi hoàn thành
            }
        };

        fetchProducts();
    }, [location]);
    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
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
            <section id="latest-products" className="py-10">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">Products By Category</h2>
                    {loading ? ( // Hiển thị thông báo loading
                        <p className="text-center">Loading products...</p>
                    ) : (
                        <div className="flex flex-wrap -mx-6">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div key={product.id} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8" onClick={() => handleProductClick(product.id)}>
                                        <div className="bg-white p-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.name}
                                                className="w-full h-80 object-contain mb-4 rounded-lg"
                                            />
                                            <a href="#" className="text-lg font-semibold mb-2">{product.name}</a>
                                            <p className="my-2">{product.category_name}</p>
                                            <div className="flex items-center mb-4">
                                                <span className="text-lg font-bold text-primary">${product.pricebuy}</span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Ngăn không cho sự kiện click trên button kích hoạt onClick của div cha
                                                    handleAddToCart(product);
                                                }}
                                                className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No products available.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

// Thêm hàm xử lý thêm vào giỏ hàng
const handleAddToCart = (product) => {
    // Logic để thêm sản phẩm vào giỏ hàng
    console.log('Added to cart:', product);
};

export default ProductsByCategory;
