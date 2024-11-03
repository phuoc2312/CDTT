import React, { useEffect, useState } from 'react';
import ProductService from '../Service/ProductService'; // Đường dẫn có thể cần được điều chỉnh
import { ApiImages } from '../Api/ApiImages'
import { useNavigate } from 'react-router-dom';
import CartService from '../Service/CartService';
function ProductSales() {
  const [productsale, setProductsale] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const limit = 5; // Giới hạn số lượng sản phẩm
      const result = await ProductService.product_sale(limit); // Gọi API để lấy danh sách sản phẩm giảm giá
      setProductsale(result.products); // Lưu sản phẩm vào state
    })();
  }, []);
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
    <section id="latest-products" className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Products Sale</h2>
        <div className="flex flex-wrap -mx-4">
          {productsale.length > 0 ? (
            productsale.map((product) => (
              <div key={product.id} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8" onClick={() => handleProductClick(product.id)}>
                <div className="bg-white p-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                  <img
                    src={`${ApiImages}/images/product/${product.product_images[0]?.thumbnail}`}
                    alt={product.name}
                    className="w-full h-80 object-contain mb-4 rounded-lg"
                  />
                  <a href="#" className="text-lg font-semibold mb-2">{product.name}</a>
                  <p className="text-gray-500 mb-2">{product.category}</p>
                  <div className="flex items-center mb-4">
                    <span className="text-lg font-bold text-primary">${product.pricesale}</span>
                    {product.pricebuy && (
                      <span className="text-sm line-through ml-2 text-gray-500">${product.pricebuy}</span>
                    )}
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
            <p className="text-center w-full">No products available.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductSales;
