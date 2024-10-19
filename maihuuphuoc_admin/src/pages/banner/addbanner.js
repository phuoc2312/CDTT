import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerService from '../../Service/BannerService'; // Thay thế bằng dịch vụ banner của bạn

function AddBanner() {
    const [banner, setBanner] = useState({
        name: '',       // Thêm trường name
        link: '',       // Thêm trường link
        description: '', // Thêm trường description
        image: null,
        position: '',
        sort_order: '',  // Thêm trường sort_order
        status: '',      // Có thể là 'active' hoặc 'inactive'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBanner({
            ...banner,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setBanner({
            ...banner,
            image: e.target.files[0], // Đổi từ thumbnail sang image
        });
    };

    const handleAddBanner = async (e) => {
        e.preventDefault();

        const formData = new FormData(); // Tạo form data để gửi kèm hình ảnh
        formData.append('name', banner.name);  // Gửi trường name
        formData.append('link', banner.link);  // Gửi trường link
        formData.append('description', banner.description);  // Gửi trường description
        formData.append('image', banner.image); // Gửi hình ảnh với tên image
        formData.append('position', banner.position);
        formData.append('sort_order', banner.sort_order);  // Gửi trường sort_order
        formData.append('status', banner.status);

        try {
            await BannerService.add(formData); // Gọi API thêm banner
            navigate('/banner'); // Điều hướng về trang danh sách banner sau khi thêm thành công
        } catch (error) {
            setError('Có lỗi xảy ra khi thêm banner');
            console.error(error);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Thêm Banner</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleAddBanner} className="space-y-4">

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Tên banner:</label>
                    <input
                        type="text"
                        name="name"
                        value={banner.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Link:</label>
                    <input
                        type="text"
                        name="link"
                        value={banner.link}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Mô tả:</label>
                    <textarea
                        name="description"
                        value={banner.description}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Hình ảnh:</label>
                    <input
                        type="file"
                        name="image" // Sử dụng tên image
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Vị trí:</label>
                    <input
                        type="text"
                        name="position"
                        value={banner.position}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Thứ tự:</label>
                    <input
                        type="number"
                        name="sort_order"
                        value={banner.sort_order}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Trạng thái:</label>
                    <select
                        name="status"
                        value={banner.status}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Chọn trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Không hoạt động</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Thêm Banner
                </button>
            </form>
        </div>
    );
}

export default AddBanner;
