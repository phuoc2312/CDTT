import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ConfigService from '../../Service/ConfigService'; // Đảm bảo bạn đã tạo ConfigService
import { Link } from 'react-router-dom';

const Config = () => {
    const [configs, setConfigs] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        site_name: '',
        email: '',
        address: '',
        hotline: '',
        phone: '',
        author: '',
        status: 0,
    });

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


    const handleEdit = (config) => {
        setSelectedConfig(config);
        setFormData({ ...config });
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gọi API để cập nhật thông tin cấu hình
            await ConfigService.update(formData.id, formData); // Gọi đúng hàm update
            setConfigs(configs.map(c => (c.id === formData.id ? formData : c))); // Cập nhật danh sách cấu hình
            setIsEditing(false); // Đóng modal
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật dữ liệu:", error);
        }
    };

    return (
        <div className="container px-4 py-6 mx-auto">
            <h1 className="mb-6 text-3xl font-bold text-center">Quản Lý Cấu Hình</h1>
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-lg">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-900 border">STT</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-900 border">ID</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-900 border">Tên Site</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-900 border">Email</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-900 border">Địa Chỉ</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-900 border">Hotline</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-900 border">Số Điện Thoại</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-900 border">Tác Giả</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-900 border">Trạng Thái</th>
                            <th className="px-6 py-3 text-sm font-medium text-left text-gray-900 border">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {configs && configs.length > 0 ? (
                            configs.map((config, index) => (
                                <tr key={config.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900 border">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 border">{config.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 border">{config.site_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 border">{config.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 border">{config.address}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 border">{config.hotline}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 border">{config.phone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 border">{config.author}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 border">{config.status}</td>
                                    <td className="px-4 py-2 border">
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => handleEdit(config)}
                                                className="text-yellow-500 hover:text-yellow-600"
                                                aria-label={`Edit ${config.site_name}`}
                                            >
                                                <FaEdit size={20} />
                                            </button>
                                        
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="px-6 py-4 text-center text-gray-500 border">
                                    Không có cấu hình nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Chỉnh Sửa Cấu Hình</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Tên Site</label>
                                <input
                                    type="text"
                                    value={formData.site_name}
                                    onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Địa Chỉ</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Hotline</label>
                                <input
                                    type="text"
                                    value={formData.hotline}
                                    onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Số Điện Thoại</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Tác Giả</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Trạng Thái</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    required
                                >
                                    <option value={0}>Không Hoạt Động</option>
                                    <option value={1}>Hoạt Động</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2">
                                    Cập Nhật
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="ml-2 bg-gray-300 rounded-lg px-4 py-2"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Config;
