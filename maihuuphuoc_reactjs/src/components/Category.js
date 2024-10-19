import React, { useEffect, useState } from 'react';
import CategoryService from '../Service/CategoryService'; // Đường dẫn tới service của bạn
import { ApiImages } from '../Api/ApiImages';

function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await CategoryService.getList(); // Gọi API để lấy danh sách danh mục
        if (result && result.categories) {
          setCategories(result.categories); // Lưu danh sách danh mục vào state
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section id="product-banners">
      <div className="container mx-auto py-10">
        <div className="flex overflow-x-auto hide-scrollbar">
          {categories.map((category) => (
            <div key={category.id} className="min-w-[200px] sm:min-w-[250px] px-2 mb-8">
              <div className="category-banner relative overflow-hidden rounded-lg shadow-lg group transform transition-transform duration-300 hover:scale-105">
                <img
                  src={
                    category.thumbnail
                      ? `${ApiImages}/images/category/${category.thumbnail}`
                      : '/path/to/default-image.jpg'
                  }
                  alt={category.name}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gray-light bg-opacity-50"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">{category.name}</h2>
                  <a
                    href={`/shop/${category.id}`}
                    className="bg-primary hover:bg-transparent border border-transparent hover:border-white text-white hover:text-white font-semibold px-4 py-2 rounded-full inline-block"
                  >
                    Shop now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Category;
