import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import ProductService from '../../Service/ProductService';
import CategoryService from '../../Service/CategoryService';
import BrandService from '../../Service/BrandService';

export default function EditProduct() {
    const { id } = useParams(); // Lấy ID từ URL

    // State để lưu trữ thông tin sản phẩm
    const [product, setProduct] = useState({
        name: '',
        pricebuy: '',
        description: '',
        slug: '',
        category_id: '',
        brand_id: '',
        content: '',
    });

    const [image, setImage] = useState(null); // State cho hình ảnh
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        // Lấy danh mục
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getList(); 
                setCategories(response.categories);
            } catch (err) {
                console.error('Lỗi khi lấy danh mục:', err);
            }
        };

        // Lấy thương hiệu
        const fetchBrands = async () => {
            try {
                const response = await BrandService.getList();
                setBrands(response.brands);
            } catch (err) {
                console.error('Lỗi khi lấy thương hiệu:', err);
            }
        };

        fetchCategories();
        fetchBrands();
    }, []);

    // Lấy thông tin sản phẩm khi component được render
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await ProductService.getId(id);
                const dapro = response.product;
                if (dapro) {
                    setProduct({ ...dapro });
                    setImage(dapro.image); // Gán hình ảnh hiện có
                } else {
                    throw new Error('Không tìm thấy sản phẩm');
                }
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
                setError('Không thể tải chi tiết sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Xử lý khi có thay đổi ở các trường input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({ ...prevState, [name]: value }));
    };

    // Xử lý khi thay đổi hình ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file); // Cập nhật state cho hình ảnh
    };

    // Xử lý khi submit form cập nhật sản phẩm
    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value); // Gán dữ liệu sản phẩm
        });
        if (image) {
            formData.append('image', image); // Gán file hình ảnh nếu có
        }

        try {
            await ProductService.update(id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/product'); // Chuyển về trang danh sách sản phẩm sau khi cập nhật
        } catch (err) {
            console.error("Lỗi khi cập nhật sản phẩm:", err.response ? err.response.data : err.message);
            setError('Không thể cập nhật sản phẩm.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Chỉnh Sửa Sản Phẩm</h1>
            <form onSubmit={handleUpdateProduct} className="mb-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">Tên sản phẩm</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        className="border px-4 py-2 rounded-lg w-full"
                        placeholder="Nhập tên sản phẩm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="slug">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={product.slug}
                        onChange={handleInputChange}
                        className="border px-4 py-2 rounded-lg w-full"
                        placeholder="Nhập slug"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="pricebuy">Giá mua</label>
                    <input
                        type="number"
                        name="pricebuy"
                        value={product.pricebuy}
                        onChange={handleInputChange}
                        className="border px-4 py-2 rounded-lg w-full"
                        placeholder="Nhập giá mua"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="category_id">Danh mục</label>
                    <select
                        name="category_id"
                        value={product.category_id}
                        onChange={handleInputChange}
                        className="border px-4 py-2 rounded-lg w-full"
                        required
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="brand_id">Thương hiệu</label>
                    <select
                        name="brand_id"
                        value={product.brand_id}
                        onChange={handleInputChange}
                        className="border px-4 py-2 rounded-lg w-full"
                        required
                    >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="description">Mô tả</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        className="border px-4 py-2 rounded-lg w-full"
                        placeholder="Nhập mô tả sản phẩm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="content">Nội dung</label>
                    <textarea
                        name="content"
                        value={product.content}
                        onChange={handleInputChange}
                        className="border px-4 py-2 rounded-lg w-full"
                        placeholder="Nhập nội dung chi tiết sản phẩm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Hình ảnh sản phẩm</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="border px-4 py-2 rounded-lg w-full"
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg flex items-center">
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}
