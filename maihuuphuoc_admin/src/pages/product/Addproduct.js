import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../Service/CategoryService';
import BrandService from '../../Service/BrandService';
function AddProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category_id: '',
        brand_id: '',
        content: '',
        description: '',
        pricebuy: '',
        priceroot: '',
        qty: '',
        status: 1,
        image: null,
    });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await axios.post('http://localhost:8000/api/product/store', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert(response.data.message);
            navigate('/product');
        } catch (error) {
            console.error('Error adding product:', error.response ? error.response.data : error);
            alert('Đã xảy ra lỗi khi thêm sản phẩm!');
        }
    };
    useEffect(() => {
        // Lấy danh mục
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getList(); // Điều chỉnh phương thức nếu cần
                setCategories(response.categories);
                console.log("categories", categories)
            } catch (err) {
                console.error('Lỗi khi lấy danh mục:', err);
            }
        };



        // Lấy thương hiệu
        const fetchBrands = async () => {
            try {
                const response = await BrandService.getList(); // Điều chỉnh phương thức nếu cần
                setBrands(response.brands);
            } catch (err) {
                console.error('Lỗi khi lấy thương hiệu:', err);
            }
        };
        fetchCategories();
        fetchBrands();
    }, []);
    return (
        <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-5 text-center">Thêm Sản Phẩm</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug:</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Danh mục:</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700"> Thương hiệu:</label>
                        <select
                            name="brand_id"
                            value={formData.brand_id}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>  
                        ))}
                         </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nội dung:</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mô tả:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá mua:</label>
                        <input
                            type="number"
                            name="pricebuy"
                            value={formData.pricebuy}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá gốc:</label>
                        <input
                            type="number"
                            name="priceroot"
                            value={formData.priceroot}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số lượng:</label>
                        <input
                            type="number"
                            name="qty"
                            value={formData.qty}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trạng thái:</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            <option value={1}>Kích hoạt</option>
                            <option value={0}>Không kích hoạt</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hình ảnh:</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-5 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
                >
                    Thêm sản phẩm
                </button>
            </form >
        </div >
    );
}

export default AddProduct;
