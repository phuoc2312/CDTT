import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import BrandService from './../Service/BrandService';
import { ApiImages } from '../Api/ApiImages';

function Brands() {
  const [brands, setBrands] = useState([]);
  const sliderRef = useRef(null);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const result = await BrandService.getList();
        setBrands(result.brands); // Gán danh sách thương hiệu vào state
      } catch (error) {
        console.error('Lỗi khi tải danh sách thương hiệu:', error);
        alert('Không thể tải danh sách thương hiệu. Vui lòng kiểm tra lại kết nối hoặc thử lại sau.');
      }
    };

    fetchBrands();
  }, []);

  // Auto scroll function
  useEffect(() => {
    const slider = sliderRef.current;
    const scrollSpeed = 1; // Scroll speed in pixels
    const scrollInterval = 10; // Delay between each step in ms

    const scrollContent = () => {
      if (slider) {
        slider.scrollLeft += scrollSpeed; // Scroll to the right

        // Reset scroll when reaching the end to loop
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0; // Jump back to the beginning for looping effect
        }
      }
    };

    const interval = setInterval(scrollContent, scrollInterval);
    return () => clearInterval(interval);
  }, []);

  const handleBrandClick = (brandId) => {
    navigate(`/products/brand?brand_id=${brandId}`); // Điều hướng đến trang sản phẩm với brandId
  };

  return (
    <section id="brands" className="bg-white py-16 px-8">
      <div className="container mx-auto max-w-screen-xl relative">
        <div className="text-center mb-12 lg:mb-20">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Discover <span className="text-primary">Our Brands</span>
          </h2>
          <p className="text-base lg:text-lg text-gray-600">Explore the top brands we feature in our store</p>
        </div>

        {/* Wrapper for Brands */}
        <div className="relative">
          {/* Brand Logos */}
          <div
            ref={sliderRef}
            className="flex items-center gap-6 overflow-x-auto scroll-smooth no-scrollbar whitespace-nowrap"
          >
            {/* Render danh sách thương hiệu nhân đôi để cuộn liên tục */}
            {brands.length > 0 ? (
              [...brands, ...brands].map((brand) => (  // Nhân đôi mảng để tạo hiệu ứng cuộn vòng lặp
                <div
                  key={brand.id} // Sử dụng brand.id làm key
                  className="flex-shrink-0 bg-white shadow-lg rounded-lg p-6 min-w-[200px] lg:min-w-[250px] transition-transform hover:scale-105"
                  onClick={() => handleBrandClick(brand.id)} // Gọi hàm khi nhấn vào thương hiệu
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Logo */}
                    <img
                      src={`${ApiImages}/images/brand/${brand.thumbnail}`}
                      alt={brand.name}
                      className="w-24 h-24 lg:w-32 lg:h-32 object-contain mb-4 rounded-md"
                    />
                    {/* Brand Name */}
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
                      {brand.name}
                    </h3>
                    {/* Description */}
                    <p className="text-sm lg:text-base text-gray-500">
                      {brand.description ? brand.description : "No description available."}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No brands available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Brands;
