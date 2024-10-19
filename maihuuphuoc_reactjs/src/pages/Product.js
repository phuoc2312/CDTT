import React, { useEffect, useState } from 'react';
import ProductService from '../Service/ProductService'; // Đường dẫn có thể cần điều chỉnh
import Header from '../components/header';
import Footer from '../components/footer';

function Product() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await ProductService.getList(); // Không truyền tham số limit nữa
                console.log(result);
                setProducts(result.products); // Gán tất cả sản phẩm vào state
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <Header />
            <section id="latest-products" className="py-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap -mx-6">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.id} className="w-full sm:w-1/2 lg:w-1/4 px-4">
                                    <div className="bg-white p-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.name}
                                            className="w-full h-80 object-contain mb-4 rounded-lg"
                                        />
                                        <a href="#" className="text-lg font-semibold mb-2">{product.name}</a>
                                        <p className="my-2">{product.category_name}</p>
                                        <div className="flex items-center mb-4">
                                            <span className="text-lg font-bold text-primary">${product.pricebuy}</span> {/* Hiển thị giá mua */}
                                        </div>
                                        <button className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No products available.</p> // Thông báo khi không có sản phẩm
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Product;
