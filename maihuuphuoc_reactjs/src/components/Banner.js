import React, { useEffect, useState } from 'react';
import 'swiper/swiper-bundle.css';
import BannerService from './../Service/BannerService';
import { ApiImages } from './../Api/ApiImages';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
const Banner = () => {
  const [banners, setBanners] = useState([]); // State để lưu danh sách banner
  const [error, setError] = useState(null); // State để lưu lỗi

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const result = await BannerService.getList(); // Gọi API để lấy danh sách banner
        const filteredBanners = result.banners.filter(banner =>
          banner.position === 'slideshow' && banner.status === 1
        ); // Lọc banner theo điều kiện position và status
        setBanners(filteredBanners); // Lưu các banner thỏa mãn điều kiện vào state
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError(err); // Xử lý lỗi nếu có
      }
    };

    fetchBanners(); // Gọi hàm fetch khi component mount
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      // Khởi tạo Swiper khi danh sách banner được tải
      const swiper = new Swiper('.swiper-container', {
        loop: true, // Cho phép lặp lại slider
        autoplay: {
          delay: 3000, 
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }
  }, [banners]); // Chỉ khởi tạo Swiper khi danh sách banner thay đổi

  return (
    <div className="slider-container border border-gray-300 rounded-lg overflow-hidden shadow-lg">
      <nav id="mobile-menu-placeholder" className="mobile-menu hidden flex flex-col items-center space-y-8 lg:hidden">
        {/* ... Mobile menu code ... */}
      </nav>

      <section id="product-slider" className="relative">
        <div className="main-slider swiper-container">
          <div className="swiper-wrapper">
            {banners.length > 0 ? (
              banners.map((banner, index) => (
                <div className="swiper-slide relative" key={index}>
                  {console.log('Banner link:', banner.link)}

                  {banner.image && (
                    <img
                      src={`${ApiImages}/images/banner/${banner.image}`}
                      alt={banner.name}
                      className="w-full h-[600px] object-contain" // Đặt kích thước và kiểu hiển thị
                    />
                  )}
                  <div className="swiper-slide-content absolute inset-0 flex flex-col justify-center items-start p-8 bg-gradient-to-t from-black to-transparent">
                    <h2 className="text-3xl md:text-7xl font-bold text-white mb-2 md:mb-4">{banner.name}</h2>
                    <p className="mb-4 text-white md:text-2xl">
                      {banner.description ? banner.description.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      )) : "No description available."}
                    </p>
                    <a
                      href={banner.link || '#'}  // Điều hướng tới đường dẫn từ API, nếu không có thì để '#'
                      className="bg-primary hover:bg-transparent text-white hover:text-white border border-transparent hover:border-white font-semibold px-4 py-2 rounded-full inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Shop now
                    </a>

                  </div>
                </div>
              ))
            ) : (
              <div className="swiper-slide">No banners available.</div> // Thông báo nếu không có banner thỏa mãn điều kiện
            )}
          </div>
        </div>
        {/* Slider Pagination */}
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-pagination"></div>
      </section>
    </div>
  );
}

export default Banner;
