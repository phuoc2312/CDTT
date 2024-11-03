import React, { useEffect, useState } from 'react';
import ConfigService from '../Service/ConfigService';
function Footer() {
  const [configs, setConfigs] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await ConfigService.getList(); // Gọi dịch vụ để lấy danh sách cấu hình
        console.log("Kết quả từ API:", result); // Kiểm tra kết quả từ API

        if (Array.isArray(result)) {
          setConfigs(result); // Nếu result là mảng
        } else {
          console.error("Kết quả không phải là một mảng hoặc không có cấu hình:", result);
          setConfigs([]); // Gán mảng rỗng nếu không phải là mảng
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
        setConfigs([]); // Gán mảng rỗng trong trường hợp có lỗi
      }
    })();
  }, []);

  return (
    <div>
      <section id="subscribe" className="py-6 lg:py-24 bg-white border-t border-gray-line">
        <div className="container mx-auto">
          <div className="flex flex-col items-center rounded-lg p-4 sm:p-0">
            <div className="mb-8">
              <h2 className="text-center text-xl font-bold sm:text-2xl lg:text-left lg:text-3xl">
                Join our newsletter and <span className="text-primary">get $50 discount</span> for your first order
              </h2>
            </div>
            <div className="flex flex-col items-center w-96">
              <form className="flex w-full gap-2">
                <input
                  placeholder="Enter your email address"
                  className="w-full flex-1 rounded-full px-3 py-2 border border-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                />
                <button className="bg-primary border border-primary hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-gray-line">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full sm:w-1/6 px-4 mb-8">
              <h3 className="text-lg font-semibold mb-4">Store</h3>
              <ul>
                <li><a href="/products/category?category_id=5" className="hover:text-primary">Điện thoại</a></li>
                <li><a href="/products/category?category_id=2" className="hover:text-primary">Tai Nghe</a></li>
                <li><a href="/products/category?category_id=21" className="hover:text-primary">LapTop</a></li>
                <li><a href="/products/category?category_id=17" className="hover:text-primary">Camera</a></li>
              </ul>
            </div>
            <div className="w-full sm:w-1/6 px-4 mb-8">
              <h3 className="text-lg font-semibold mb-4">Pages</h3>
              <ul>
                <li><a href="/" className="hover:text-primary">Home</a></li>
                <li><a href="/" className="hover:text-primary">Category</a></li>
                <li><a href="/" className="hover:text-primary">Brand</a></li>
                <li><a href="/" className="hover:text-primary">Blogs</a></li>
                <li><a href="/" className="hover:text-primary">Product</a></li>
              </ul>
            </div>
            <div className="w-full sm:w-1/6 px-4 mb-8">
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul>
                <li><a href="/cart.html" className="hover:text-primary">Cart</a></li>
                <li><a href="/register.html" className="hover:text-primary">Registration</a></li>
                <li><a href="/register.html" className="hover:text-primary">Login</a></li>
              </ul>
            </div>
            <div className="w-full sm:w-1/6 px-4 mb-8">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <ul>
                <li className="flex items-center mb-2">
                  <img src="/assets/images/social_icons/facebook.svg" alt="Facebook" className="w-4 h-4 transition-transform transform hover:scale-110 mr-2" />
                  <a href="#" className="hover:text-primary">Facebook</a>
                </li>
                <li className="flex items-center mb-2">
                  <img src="/assets/images/social_icons/twitter.svg" alt="Twitter" className="w-4 h-4 transition-transform transform hover:scale-110 mr-2" />
                  <a href="#" className="hover:text-primary">Twitter</a>
                </li>
                <li className="flex items-center mb-2">
                  <img src="/assets/images/social_icons/instagram.svg" alt="Instagram" className="w-4 h-4 transition-transform transform hover:scale-110 mr-2" />
                  <a href="#" className="hover:text-primary">Instagram</a>
                </li>
                <li className="flex items-center mb-2">
                  <img src="/assets/images/social_icons/pinterest.svg" alt="Instagram" className="w-4 h-4 transition-transform transform hover:scale-110 mr-2" />
                  <a href="#" className="hover:text-primary">Pinterest</a>
                </li>
                <li className="flex items-center mb-2">
                  <img src="/assets/images/social_icons/youtube.svg" alt="Instagram" className="w-4 h-4 transition-transform transform hover:scale-110 mr-2" />
                  <a href="#" className="hover:text-primary">YouTube</a>
                </li>
              </ul>
            </div>
            <div className="w-full sm:w-2/6 px-4 mb-8">
              {configs && configs.length > 0 ? (
                configs.map((config) => (
                  <div key={config.id}>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <p><img src="assets/images/template-logo.png" alt="Logo" className="h-[60px] mb-4" /></p>
                    <p className='text-lg font-bold my-4'>{config.address}</p>
                    <p className="text-lg font-bold my-4">Hotline: {config.hotline}</p>
                    <p className="text-lg font-bold my-4">Phone: {config.phone}</p>
                    <a href={`mailto:${config.email}`} className="text-lg font-bold my-4">Email: {config.email}</a>
                  </div>
                ))
              ) : (
                <p>No configs found</p>
              )}
            </div>

          </div>
        </div>

        <div className="py-6 border-t border-gray-line">
          <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
            <div className="w-full lg:w-3/4 text-center lg:text-left mb-4 lg:mb-0">
              <p className="mb-2 font-bold">© 2024 Your Company. All rights reserved.</p>
              <ul className="flex justify-center lg:justify-start space-x-4 mb-4 lg:mb-0">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
              </ul>
              <p className="text-sm mt-4">
                Your shop's description goes here. This is a brief introduction to your shop and what you offer.
              </p>
            </div>
            <div className="w-full lg:w-1/4 text-center lg:text-right">
              <img src="/assets/images/social_icons/paypal.svg" alt="PayPal" className="inline-block h-8 mr-2" />
              <img src="/assets/images/social_icons/stripe.svg" alt="Stripe" className="inline-block h-8 mr-2" />
              <img src="/assets/images/social_icons/visa.svg" alt="Visa" className="inline-block h-8" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
