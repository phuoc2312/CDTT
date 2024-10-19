import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa'; // Thêm các icon FaToggleOn và FaToggleOff
import { Link } from 'react-router-dom';
import { IoMdAddCircleOutline } from 'react-icons/io';
import TopicService from '../../Service/TopicService';

const Topic = () => {
    const [topics, setTopics] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const result = await TopicService.getList();
                setTopics(result.topics);
            } catch (err) {
                console.error("Error fetching topics:", err);
                setError(err);
            }
        })();
    }, []);

    const handleDeleteTopic = async (id) => {
        if (window.confirm("Are you sure you want to delete this topic?")) {
            try {
                await TopicService.delete(id);
                setTopics(topics.filter(topic => topic.id !== id));
            } catch (err) {
                console.error("Error deleting topic:", err);
                setError(err);
            }
        }
    };

    const handleToggleActive = async (topic) => {
        // Thay đổi status giữa 0 và 1
        const updatedTopic = { ...topic, status: topic.status === 1 ? 0 : 1 };
        try {
            // Gọi API để cập nhật topic với giá trị status mới
            await TopicService.update(topic.id, updatedTopic);

            // Cập nhật state để thay đổi UI
            setTopics(topics.map(t => (t.id === topic.id ? updatedTopic : t)));
        } catch (err) {
            console.error("Error updating topic status:", err);
            setError(err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-700">Quản lý Chủ Đề Bài Viết</h1>
                <Link
                    to="/topic/add"
                    className="flex items-center text-white bg-blue-500 px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                >
                    <IoMdAddCircleOutline className="mr-2" /> Thêm chủ đề bài viết
                </Link>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoạt động</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.length > 0 ? (
                            topics.map((topic, index) => (
                                <tr key={topic.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{topic.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{topic.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{topic.description}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {/* Sử dụng FaToggleOn và FaToggleOff */}
                                        {topic.status === 1 ? (
                                            <FaToggleOn
                                                onClick={() => handleToggleActive(topic)}
                                                className="cursor-pointer text-2xl text-green-500"
                                            />
                                        ) : (
                                            <FaToggleOff
                                                onClick={() => handleToggleActive(topic)}
                                                className="cursor-pointer text-2xl text-red-400"
                                            />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-red-700 flex space-x-2">
                                        <Link
                                            to={`/topic/edit/${topic.id}`}
                                            className="text-blue-500 hover:text-blue-700 transition duration-300"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteTopic(topic.id)}
                                            className="text-red-500 hover:text-red-700 transition duration-300"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">Không có chủ đề nào để hiển thị.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Topic;
