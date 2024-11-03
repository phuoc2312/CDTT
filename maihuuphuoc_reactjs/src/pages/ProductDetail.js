import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductService from '../Service/ProductService';
import RelatedProducts from './RelatedProducts'; // Import sản phẩm liên quan
import Header from '../components/header';
import Footer from '../components/footer';
import CartService from '../Service/CartService';

function ProductDetail() {
  const { id } = useParams(); // Lấy ID từ URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm mặc định là 1

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await ProductService.getId(id);
        if (result && result.status) {
          const productData = result.product;
          setProduct(productData);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError('Không thể lấy thông tin sản phẩm');
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    // Logic để thêm sản phẩm vào giỏ hàng với số lượng
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
  


  const handleQuantityChange = (e) => {
    const value = Math.max(1, e.target.value); // Đảm bảo số lượng không nhỏ hơn 1
    setQuantity(value);
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!product) {
    return <p className="text-center">Đang tải thông tin sản phẩm...</p>;
  }

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center mb-6">{product.name}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Hình ảnh sản phẩm */}
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
          {/* Thông tin sản phẩm */}
          <div className="md:w-1/2 md:pl-6 flex flex-col justify-between">
            <div>
              <p className="text-4xl font-bold text-primary">
                Giá: <span className="text-gray-800">${product.pricebuy}</span>
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Danh mục: <span className="font-semibold">{product.category_name}</span>
              </p>
              <p className="text-gray-700 mb-4">
                Mô tả: <span className="italic">{product.description}</span>
              </p>
              <p className="text-gray-700 mb-4">
                Nội dung: <span className="italic">{product.content}</span>
              </p>
            </div>

            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-4 font-semibold">Số lượng:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                onChange={handleQuantityChange}
                className="border rounded-lg p-2 w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        <RelatedProducts productId={id} categoryId={product.category_id} />

      </div>
      <Footer />
    </div>
  );
}

export default ProductDetail;
