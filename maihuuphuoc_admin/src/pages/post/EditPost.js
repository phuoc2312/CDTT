import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Lấy id bài viết từ URL và điều hướng
import PostService from '../../Service/PostService'; // Dùng để gọi API lưu bài viết
import TopicService from '../../Service/TopicService';

function EditPost() {
    const { id } = useParams(); // Lấy id của bài viết từ URL
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
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            const response = await PostService.update(id, formData);
            if (response.status) {
                alert('Cập nhật bài viết thành công!');
                navigate('/post'); // Điều hướng về trang danh sách bài viết
            } else {
                alert('Cập nhật bài viết thất bại.');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
            alert('Đã xảy ra lỗi khi cập nhật bài viết.');
        }
    };

    // Lấy thông tin bài viết để điền vào form
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await PostService.getId(id); // Lấy bài viết từ API
                const post = postResponse.post;
                setTitle(post.title);            // Set tiêu đề
                setSlug(post.slug);              // Set slug
                setContent(post.content);        // Set nội dung
                setTopicId(post.topic_id);       // Set topic_id
               // setCurrentThumbnail(post.thumbnail); // Set ảnh hiện tại
            } catch (error) {
                console.error('Lỗi khi lấy thông tin bài viết:', error);
            }
        };

        // Lấy danh mục (topics)
        const fetchTopics = async () => {
            try {
                const topicResponse = await TopicService.getList(); // Lấy danh mục
                setTopics(topicResponse.topics);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách topics:', error);
            }
        };

        fetchPost();  // Lấy thông tin bài viết
        fetchTopics(); // Lấy danh mục
    }, [id]);

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold mb-6 text-center">Chỉnh sửa Bài viết</h1>
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
                    <label className="block text-sm font-medium text-gray-700">Chủ đề</label>
                    <select
                        value={topicId}
                        onChange={(e) => setTopicId(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="">Chọn danh mục</option>
                        {topics.map((topic) => (
                            <option key={topic.id} value={topic.id}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Hình ảnh </label>
              
                    <input
                        type="file"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        onChange={handleThumbnailChange}
                        accept="image/*"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Cập nhật bài viết
                </button>
            </form>
        </div>
    );
}

export default EditPost;
