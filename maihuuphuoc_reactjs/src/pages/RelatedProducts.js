import React, { useEffect, useState } from 'react';
import ProductService from '../Service/ProductService';
import { Link } from 'react-router-dom';
import CartService from '../Service/CartService';

function RelatedProducts({ productId, categoryId }) {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const result = await ProductService.getRelatedProducts(productId, categoryId);
                if (result && result.status) {
                    setRelatedProducts(result.related_products);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError('Không thể tải sản phẩm liên quan');
            }
        };

        fetchRelatedProducts();
    }, [productId, categoryId]); // Chạy lại khi productId hoặc categoryId thay đổi

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }
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
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
            {relatedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {relatedProducts.map((product) => (
                        <div key={product.id} className=" bg-white p-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                            <Link to={`/product/${product.id}`} className="flex flex-col h-full">
                                <img src={product.thumbnail} alt={product.name} className="w-full h-80 object-contain mb-4 rounded-lg" />
                                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                                <p className="text-lg font-bold text-primary">${product.pricebuy}</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Ngăn không cho sự kiện click trên button kích hoạt onClick của div cha
                                        handleAddToCart(product);
                                    }}
                                    className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                                    Add to Cart
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Không có sản phẩm nào liên quan.</p>
            )}
        </div>
    );
}

export default RelatedProducts;
