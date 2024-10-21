import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductService from '../Service/ProductService';

function ProductDetail() {
  const { id } = useParams(); // Lấy ID từ URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm mặc định là 1

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await ProductService.getId(id);
        console.log('API response:', result); // Kiểm tra phản hồi từ API

        if (result && result.status) {
          const productData = result.product; // Lấy dữ liệu sản phẩm
          if (productData) {
            console.log('Product data:', productData); // Kiểm tra dữ liệu sản phẩm
            setProduct(productData); // Gán dữ liệu sản phẩm
          } else {
            console.error('Dữ liệu sản phẩm không tồn tại');
            setError('Dữ liệu sản phẩm không tồn tại');
          }
        } else {
          console.error('Lỗi:', result.message);
          setError(result.message); // Gán thông báo lỗi vào state
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
        setError('Không thể lấy thông tin sản phẩm');
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Logic để thêm sản phẩm vào giỏ hàng với số lượng
    console.log(`Thêm ${quantity} sản phẩm vào giỏ hàng:`, product);
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
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-6">{product.name}</h1>
      <div className="flex flex-col md:flex-row">
        {/* Hình ảnh sản phẩm */}
        <div className="md:w-1/2 mb-6 md:mb-0">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          />
        </div>
        {/* Thông tin sản phẩm */}
        <div className="md:w-1/2 md:pl-6">
          <p className="text-3xl font-semibold text-green-600 mb-2">
            Giá: <span className="text-gray-800">${product.pricebuy}</span>
          </p>
          <p className="text-lg text-gray-700 mb-2">Danh mục: <span className="font-semibold">{product.category_name}</span></p>
          <p className="text-gray-700 mb-4">Mô tả: <span className="italic">{product.description}</span></p>
          <p className="text-gray-700 mb-4">Nội dung: <span className="italic">{product.content}</span></p>
          
          <div className="flex items-center mb-4">
            <label htmlFor="quantity" className="mr-2 font-semibold">Số lượng:</label>
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-300 ease-in-out"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
