import React, { useEffect, useState } from 'react';
import PostService from '../../Service/PostService';
import { ApiImages } from '../../Api/ApiImages';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await PostService.getList();
                console.log('Response từ API:', response);

                if (response.status) {
                    if (Array.isArray(response.posts)) {
                        setPosts(response.posts);
                    } else {
                        console.error('Posts không phải là một mảng:', response.posts);
                        setError('Không có bài viết nào.');
                    }
                } else {
                    setError(response.message);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
                setError('Đã xảy ra lỗi khi gọi API.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?');
        if (confirmDelete) {
            try {
                const response = await PostService.delete(id);
                if (response.status) {
                    // Xóa thành công, cập nhật lại danh sách bài viết
                    setPosts(posts.filter(post => post.id !== id));
                    alert('Bài viết đã được đưa vào thùng rác.');
                } else {
                    alert('Xóa thất bại: ' + response.message);
                }
            } catch (error) {
                console.error('Lỗi khi xóa bài viết:', error);
                alert('Đã xảy ra lỗi khi xóa bài viết.');
            }
        }
    };

    const toggleStatus = async (post) => {
        const updatedStatus = post.status === 1 ? 0 : 1; // Chuyển đổi trạng thái giữa 1 và 0
        try {
            const response = await PostService.updateStatus(post.id, { status: updatedStatus }); // Cập nhật trạng thái
            if (response.status) {
                // Cập nhật danh sách bài viết với trạng thái mới
                setPosts(prevPosts =>
                    prevPosts.map(p => p.id === post.id ? { ...p, status: updatedStatus } : p)
                );
            }
        } catch (err) {
            console.error("Error updating post status:", err);
            setError(err); // Xử lý lỗi nếu có
        }
    };

    if (loading) {
        return <div className="text-center text-gray-600 text-lg">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 text-lg">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Quản lý Bài viết</h1>
                <Link
                    to="/post/add"
                    className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition mb-4"
                >
                    <IoMdAddCircleOutline size={20} />
                    Thêm bài viết
                </Link>
            </div>
            {posts.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">Không có bài viết nào để hiển thị.</div>
            ) : (
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={`${ApiImages}/images/post/${post.thumbnail}`}
                                            alt={post.title}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {post.content.length > 50 ? `${post.content.substring(0, 50)}...` : post.content}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <button onClick={() => toggleStatus(post)}>
                                            {post.status === 1 ? (
                                                <FaToggleOn className="text-green-500 w-6 h-6" />
                                            ) : (
                                                <FaToggleOff className="text-red-500 w-6 h-6" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4 mt-8">
                                        <Link
                                            to={`/post/edit/${post.id}`}
                                            className="mr-2 px-4 py-2 text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit className="inline" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-600 flex items-center"
                                        >
                                            <FaTrash className="mr-2" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Post;
