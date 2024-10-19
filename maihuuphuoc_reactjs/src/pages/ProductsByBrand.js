import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductService from '../Service/ProductService';
import Footer from '../components/footer';
import Header from '../components/header';

const ProductsByBrand = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            const queryParams = new URLSearchParams(location.search);
            const brandId = queryParams.get('brand_id'); // Lấy brand_id từ query parameters

            try {
                const response = await ProductService.getProductsByBrand(brandId); // Gọi API để lấy sản phẩm theo thương hiệu
                setProducts(response.products); // Giả sử response.products chứa danh sách sản phẩm
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false); // Đặt loading thành false sau khi hoàn thành
            }
        };

        fetchProducts();
    }, [location]);

    return (
        <div>
            <Header />
            <section id="latest-products" className="py-10">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">Products By Brand</h2>
                    {loading ? ( // Hiển thị thông báo loading
                        <p className="text-center">Loading products...</p>
                    ) : (
                        <div className="flex flex-wrap -mx-6">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div key={product.id} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
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
                                                className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full"
                                                onClick={() => handleAddToCart(product)} // Xử lý thêm vào giỏ hàng
                                            >
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

export default ProductsByBrand;
