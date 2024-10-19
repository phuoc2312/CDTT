import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa'; // Thêm icon công tắc
import BannerService from '../../Service/BannerService';
import { ApiImages } from '../../Api/ApiImages';
import { Link } from 'react-router-dom';
import { IoMdAddCircleOutline } from 'react-icons/io';

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const result = await BannerService.getList(); // Gọi API để lấy danh sách banner
                setBanners(result.banners); // Lưu toàn bộ banner vào state
            } catch (err) {
                console.error("Error fetching banners:", err);
                setError(err); // Xử lý lỗi nếu có
            }
        };

        fetchBanners(); // Gọi hàm fetch khi component mount
    }, []);

    const handleDeleteBanner = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa banner này không?")) {
            try {
                await BannerService.delete(id); // Gọi API để xóa banner
                setBanners(prevBanners => prevBanners.filter(banner => banner.id !== id)); // Xóa banner khỏi danh sách hiện tại
            } catch (err) {
                console.error("Error deleting banner:", err);
                setError(err);
            }
        }
    };

    const toggleStatus = async (banner) => {
        const updatedStatus = banner.status === 1 ? 0 : 1; // Chuyển đổi trạng thái giữa 1 và 0
        try {
            await BannerService.updateStatus(banner.id, { status: updatedStatus }); // Cập nhật trạng thái
            setBanners(prevBanners => prevBanners.map(b => b.id === banner.id ? { ...b, status: updatedStatus } : b)); // Cập nhật danh sách banner với trạng thái mới
        } catch (err) {
            console.error("Error updating banner status:", err);
            setError(err); // Xử lý lỗi nếu có
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Quảng cáo</h1>
                <Link
                    to="/banner/add"
                    className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg shadow transition flex items-center"
                >
                    <IoMdAddCircleOutline className="mr-2" />
                    Thêm quảng cáo
                </Link>
            </div>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">STT</th>
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Id</th>
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Tên</th>
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Hình ảnh</th>
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Vị trí</th>
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Trạng thái</th>
                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {banners.length > 0 ? (
                        banners.map((banner, index) => (
                            <tr key={banner.id} className="hover:bg-gray-100 transition">
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{index + 1}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{banner.id}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{banner.name}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">
                                    {banner.image && (
                                        <img src={`${ApiImages}/images/banner/${banner.image}`} alt={banner.name} className="w-16 h-16 object-cover rounded-md shadow" />
                                    )}
                                </td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{banner.position}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">
                                    <button onClick={() => toggleStatus(banner)} aria-label={`Toggle status for banner ${banner.name}`}>
                                        {banner.status === 1 ? (
                                            <FaToggleOn className="text-green-500 text-2xl" />
                                        ) : (
                                            <FaToggleOff className="text-red-500 text-2xl" />
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900 flex space-x-2">
                                    <Link
                                        to={`/banner/edit/${banner.id}`}
                                        className="text-blue-700 hover:text-blue-700"
                                        aria-label={`Edit banner ${banner.name}`}
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteBanner(banner.id)}
                                        aria-label={`Delete banner ${banner.name}`}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">Không có quảng cáo nào</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {error && <p className="text-red-500 mt-4">{error.message}</p>} {/* Hiển thị lỗi nếu có */}
        </div>
    );
};

export default Banner;
