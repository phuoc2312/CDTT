import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";

import TopicService from '../../Service/TopicService';

export default function EditTopic() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [topic, setTopic] = useState({
        name: '',
        description: '',
        slug: '',
        sort_order: '',
        status: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await TopicService.getId(id);
                const dataUser = response.topic;
                if (dataUser) {
                    setTopic({
                        name: dataUser.name || '',
                        slug: dataUser.slug || '',
                        description: dataUser.description || '',
                        sort_order: dataUser.sort_order || '',
                        status: dataUser.status || '',
                    });
                } else {
                    throw new Error('Không tìm thấy chủ đề');
                }
            } catch (err) {
                console.error("Lỗi khi lấy thông tin chủ đề:", err);
                setError('Không thể tải thông tin chủ đề.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTopic(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', topic.name);
        formData.append('slug', topic.slug);
        formData.append('description', topic.description);
        formData.append('sort_order', topic.sort_order);
        formData.append('status', topic.status);

        try {
            await TopicService.update(id, formData); // Gửi FormData lên backend
            navigate('/topic'); // Chuyển hướng đến danh sách chủ đề
        } catch (err) {
            console.error("Lỗi khi cập nhật chủ đề:", err.response ? err.response.data : err.message);
            setError('Không thể cập nhật chủ đề.');
        }
    };

    if (loading) return <div className="text-center">Đang tải...</div>;
    if (error) return <div className="text-red-600 text-center">{error}</div>;

    return (
        <div className="container mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Chỉnh Sửa Chủ Đề</h1>
            <form onSubmit={handleUpdateUser} className="mb-6 flex flex-col space-y-4 bg-white shadow-md rounded-lg p-4 max-w-xl mx-auto">
                <label className="font-semibold">Tên</label>
                <input
                    type="text"
                    name="name"
                    value={topic.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên chủ đề"
                    required
                />

                <label className="font-semibold">Slug</label>
                <input
                    type="text"
                    name="slug"
                    value={topic.slug}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập slug"
                    required
                />

                <label className="font-semibold">Mô Tả</label>
                <textarea
                    name="description"
                    value={topic.description}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả"
                    required
                />

                <label className="font-semibold">Trạng Thái</label>
                <select
                    name="status"
                    value={topic.status}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="">Chọn trạng thái</option>
                    <option value="1">Hoạt động</option>
                    <option value="0">Không hoạt động</option>
                </select>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}
