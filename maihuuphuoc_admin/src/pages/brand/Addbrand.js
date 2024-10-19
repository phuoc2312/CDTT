import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandService from '../../Service/BrandService';

function AddBrand() {
    const [brand, setBrand] = useState({
        name: '',
        slug: '',
        description: '',
        thumbnail: null, // Đổi từ image sang thumbnail
        sort_order: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBrand({
            ...brand,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setBrand({
            ...brand,
            thumbnail: e.target.files[0], 
        });
    };

    const handleAddBrand = async (e) => {
        e.preventDefault();

        const formData = new FormData(); 
        formData.append('name', brand.name);
        formData.append('slug', brand.slug);
        formData.append('description', brand.description);
        formData.append('thumbnail', brand.thumbnail); 
        formData.append('sort_order', brand.sort_order);

        try {
            await BrandService.add(formData); // Gọi API thêm brand
            navigate('/brand'); // Điều hướng về trang danh sách thương hiệu sau khi thêm thành công
        } catch (error) {
            setError('Có lỗi xảy ra khi thêm thương hiệu');
            console.error(error);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Thêm Thương Hiệu</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleAddBrand} className="space-y-4">
                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Tên thương hiệu:</label>
                    <input
                        type="text"
                        name="name"
                        value={brand.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Slug:</label>
                    <input
                        type="text"
                        name="slug"
                        value={brand.slug}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Mô tả:</label>
                    <textarea
                        name="description"
                        value={brand.description}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Hình ảnh:</label>
                    <input
                        type="file"
                        name="thumbnail" // Đổi tên trường từ image thành thumbnail
                        accept="images/brand/*"
                        onChange={handleFileChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Thứ tự:</label>
                    <input
                        type="number"
                        name="sort_order"
                        value={brand.sort_order}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Thêm Thương Hiệu
                </button>
            </form>
        </div>
    );
}

export default AddBrand;
