import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import BannerService from '../../Service/BannerService';

export default function EditBanner() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [banners, setBanner] = useState({
        name: '',
        link: '',
        image: '',
        description: '',
        position: '',
        sort_order: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await BannerService.getId(id);
                const databanner = response.banner;
                if (databanner) {
                    setBanner({
                        name: databanner.name || '',
                        link: databanner.link || '',
                        image: databanner.image || '',
                        description: databanner.description || '',
                        position: databanner.position || '',
                        sort_order: databanner.sort_order || '',
                    });
                } else {
                    throw new Error('Banner not found');
                }
            } catch (err) {
                console.error("Error fetching banner:", err);
                setError('Failed to load banner details.');
            } finally {
                setLoading(false);
            }
        };

        fetchBanner();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBanner(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setBanner(prevState => ({
            ...prevState,
            image: e.target.files[0]
        }));
    };

    const handleUpdateBanner = async (e) => {
        e.preventDefault();

        // Kiểm tra định dạng URL
        const urlPattern = /^(http|https):\/\/[^ "]+$/;
        if (!urlPattern.test(banners.link)) {
            setError('Link must be a valid URL.');
            return;
        }

        const formData = new FormData();
        formData.append('name', banners.name);
        formData.append('link', banners.link);

        // Chỉ thêm ảnh mới nếu người dùng đã chọn một ảnh
        if (banners.image instanceof File) {
            formData.append('image', banners.image);
        }

        formData.append('description', banners.description);
        formData.append('position', banners.position);
        formData.append('sort_order', banners.sort_order);

        try {
            const response = await BannerService.update(id, formData);
            if (response.status === false && response.errors) {
                setError('Validation errors: ' + JSON.stringify(response.errors));
            } else {
                navigate('/banner');
            }
        } catch (err) {
            console.error("Error updating banner:", err.response ? err.response.data : err.message);
            if (err.response && err.response.data.errors) {
                setError('Validation errors: ' + JSON.stringify(err.response.data.errors));
            } else {
                setError('Failed to update banner.');
            }
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Chỉnh Sửa Banner</h2>
            <form onSubmit={handleUpdateBanner} className="space-y-4">
                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Tên banner:</label>
                    <input
                        type="text"
                        name="name"
                        value={banners.name}
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
                        value={banners.link}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Chi tiết:</label>
                    <textarea
                        name="description"
                        value={banners.description}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Hình ảnh:</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Vị trí:</label>
                    <select
                        name="position"
                        value={banners.position}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Chọn vị trí</option>
                        <option value="slideshow">Slideshow</option>
                        <option value="ads">Ads</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Số thứ tự:</label>
                    <input
                        type="number"
                        name="sort_order"
                        value={banners.sort_order}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                >
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}
