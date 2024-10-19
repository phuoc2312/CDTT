import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Header from '../../components/header';
import CategoryService from '../../Service/CategoryService';
import { ApiImages } from '../../Api/ApiImages';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '', thumbnail: null });
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const result = await CategoryService.getList();
            if (result && result.categories) {
                setCategories(result.categories);
            } else {
                console.error('No categories found');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddOrUpdateCategory = async () => {
        if (newCategory.name && newCategory.description) {
            try {
                const formData = new FormData();
                formData.append('name', newCategory.name);
                formData.append('slug', newCategory.slug);
                formData.append('description', newCategory.description);
                if (newCategory.thumbnail) {
                    formData.append('thumbnail', newCategory.thumbnail);
                }

                if (editCategoryId) {
                    await CategoryService.update(editCategoryId, formData);
                } else {
                    await CategoryService.add(formData);
                }

                resetForm();
                fetchCategories();
            } catch (error) {
                console.error('Error adding/updating category:', error.response ? error.response.data : error.message);
                alert('Thao tác không thành công. Vui lòng kiểm tra và thử lại.');
            }
        } else {
            alert('Vui lòng điền đủ tên và mô tả cho danh mục.');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            try {
                await CategoryService.delete(id);
                setCategories(categories.filter((category) => category.id !== id));
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Xóa danh mục không thành công. Có thể ID không tồn tại.');
            }
        }
    };

    const handleEditCategory = (category) => {
        setNewCategory(category);
        setEditCategoryId(category.id);
        setIsFormVisible(true);
    };

    const toggleStatus = async (category) => {
        try {
            // Xác định trạng thái mới: 1 cho bật, 2 cho tắt
            const newStatus = category.status === 1 ? 2 : 1;

            // Gửi yêu cầu cập nhật trạng thái lên server
            await CategoryService.updateStatus(category.id, newStatus);

            // Cập nhật lại trạng thái trong danh sách categories
            setCategories(
                categories.map((cat) =>
                    cat.id === category.id ? { ...cat, status: newStatus } : cat
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Cập nhật trạng thái không thành công.');
        }
    };


    const resetForm = () => {
        setNewCategory({ name: '', slug: '', description: '', thumbnail: null });
        setIsFormVisible(false);
        setEditCategoryId(null);
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-6">
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="mb-4 px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                    {isFormVisible ? 'Ẩn Form' : 'Thêm Danh Mục'}
                </button>

                {isFormVisible && (
                    <div className="p-8 mb-12 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Danh Mục Category</h1>
                        <h2 className="mb-6 text-xl font-semibold text-indigo-600">
                            {editCategoryId ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}
                        </h2>
                        <input
                            type="text"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            placeholder="Tên danh mục"
                            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="text"
                            value={newCategory.slug}
                            onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                            placeholder="Slug danh mục"
                            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                        />
                        <textarea
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            placeholder="Mô tả danh mục"
                            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setNewCategory({ ...newCategory, thumbnail: file });
                                }
                            }}
                            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                        />
                        <button
                            onClick={handleAddOrUpdateCategory}
                            className="px-6 py-3 w-24 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        >
                            {editCategoryId ? 'Cập Nhật' : 'Thêm'}
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-md">
                            {category.thumbnail && (
                                <img
                                    src={`${ApiImages}/images/category/${category.thumbnail}`}
                                    alt={category.name}
                                    className="w-24 h-24 object-cover mr-4 rounded"
                                />
                            )}
                            <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
                            <p className="text-gray-600">{category.description}</p>
                            <div className="mt-4 flex items-center space-x-3">
                                <button
                                    onClick={() => toggleStatus(category)}
                                    className={category.status === 1 ? "text-green-500 hover:text-green-600" : "text-red-500 hover:text-red-600"}
                                >
                                    {category.status === 1 ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                </button>

                                <button
                                    onClick={() => handleEditCategory(category)}
                                    className="text-yellow-500 hover:text-yellow-600"
                                >
                                    <FaEdit size={24} />
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <FaTrashAlt size={24} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Categories;
