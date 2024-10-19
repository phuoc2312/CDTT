import React, { useEffect, useState } from 'react';
import ProductService from '../Service/ProductService'; // Đường dẫn có thể cần được điều chỉnh
import { ApiImages } from '../Api/ApiImages'
function ProductSales() {
  const [productsale, setProductsale] = useState([]);

  useEffect(() => {
    (async () => {
      const limit = 5; // Giới hạn số lượng sản phẩm
      const result = await ProductService.product_sale(limit); // Gọi API để lấy danh sách sản phẩm giảm giá
      setProductsale(result.products); // Lưu sản phẩm vào state
    })();
  }, []);

  return (
    <section id="latest-products" className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Products Sale</h2>
        <div className="flex flex-wrap -mx-4">
          {productsale.length > 0 ? (
            productsale.map((product) => (
              <div key={product.id} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
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
                  <button className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
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
