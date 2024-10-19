import React, { useEffect, useState } from 'react';
import PostService from '../../Service/PostService'; // Dùng để gọi API lưu bài viết
import { useNavigate } from 'react-router-dom'; // Điều hướng sau khi thêm bài viết
import TopicService from '../../Service/TopicService';

function AddPost() {
    const navigate = useNavigate();

    // Các state lưu giá trị từ form
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [topicId, setTopicId] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [topics, setTopics] = useState([]);

    // Xử lý khi người dùng chọn ảnh
    const handleThumbnailChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tạo form data để gửi cùng với file ảnh
        const formData = new FormData();
        formData.append('title', title);
        formData.append('slug', slug);
        formData.append('content', content);
        formData.append('topic_id', topicId);
        formData.append('thumbnail', thumbnail);

        try {
            const response = await PostService.add(formData); // Đúng phương thức
            if (response.status) {
                alert('Thêm bài viết thành công!');
                navigate('/post'); // Điều hướng về trang danh sách bài viết
            } else {
                alert('Thêm bài viết thất bại.');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
            alert('Đã xảy ra lỗi khi thêm bài viết.');
        }
    };

    // Lấy danh mục topic từ API
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await TopicService.getList();
                setTopics(response.topics);
            } catch (err) {
                console.error('Lỗi khi lấy topic:', err);
            }
        };
        fetchTopics();
    }, []);

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold mb-6 text-center">Thêm Bài viết mới</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                    <textarea
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        rows="6"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Chủ đề </label>
                    <select
                        name="topicId"
                        value={topicId}
                        onChange={(e) => setTopicId(e.target.value)} // Đúng phương thức xử lý
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
                        <option value="">Chọn danh mục</option>
                        {topics.map((topic) => (
                            <option key={topic.id} value={topic.id}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                    <input
                        type="file"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        onChange={handleThumbnailChange}
                        accept="image/*"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Thêm bài viết
                </button>
            </form>
        </div>
    );
}

export default AddPost;
