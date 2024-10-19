import React, { useEffect, useState } from 'react';
import BrandService from '../../Service/BrandService';
import { useParams, useNavigate } from 'react-router-dom';

const EditBrand = () => {
    const [brand, setBrand] = useState(null);
    const [image, setImage] = useState(null); // State cho hình ảnh
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const result = await BrandService.getId(id);
                if (result && result.status) {
                    setBrand(result.brand);
                } else {
                    alert('Không thể tải thông tin thương hiệu. Vui lòng thử lại sau.');
                }
            } catch (error) {
                console.error('Lỗi khi tải thông tin thương hiệu:', error);
                alert('Không thể tải thông tin thương hiệu. Vui lòng thử lại sau.');
            }
        };

        fetchBrand();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBrand((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Lưu trữ file hình ảnh
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', brand.name);
            formData.append('slug', brand.slug); 
            formData.append('description', brand.description); 
            formData.append('status', brand.status); 

            if (image) {
                formData.append('image', image);
            }

            const response = await BrandService.update(id, formData);
            if (response.status) {
                alert('Cập nhật thương hiệu thành công!');
                navigate('/brand');
            } else {
                alert('Cập nhật không thành công. Vui lòng kiểm tra lại.');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật thương hiệu:', error);
            alert('Không thể cập nhật thương hiệu. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Chỉnh sửa Thương Hiệu</h1>
            {brand ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Tên thương hiệu:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={brand.name || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                            Slug:
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={brand.slug || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Mô tả:
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={brand.description || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                            rows="3"
                        />
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Hình ảnh:
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Cập nhật
                    </button>
                </form>
            ) : (
                <p className="text-center">Đang tải thông tin thương hiệu...</p>
            )}
        </div>
    );
};

export default EditBrand;
