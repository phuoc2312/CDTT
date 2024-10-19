import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';
import ProductService from '../../Service/ProductService';

function Product() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await ProductService.getList({ limit: 20 });
                console.log(result);
                setProducts(result.products);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm với ID: ${id}?`)) {
            try {
                const response = await ProductService.delete(id);
                if (response.status) {
                    setProducts(products.map(product =>
                        product.id === id ? { ...product, status: 2 } : product
                    ));
                    alert(`Đã chuyển sản phẩm với ID: ${id} vào thùng rác`);
                }
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
            }
        }
    };

    const handleEdit = (id) => {
        alert(`Chỉnh sửa sản phẩm với ID: ${id}`);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-4">Danh Sách Sản Phẩm</h1>
                <Link
                    to="/product/add"
                    className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition mb-4"
                >
                    <IoMdAddCircleOutline size={20} />
                    Thêm sản phẩm
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">STT</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">ID</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Tên sản phẩm</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Hình ảnh</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Thương hiệu</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Giá giảm</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Giá nhập</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Giá mua</th> 
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Mô tả</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Danh mục</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Số lượng</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Slug</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Nội dung</th>
                            <th className="px-4 py-3 border-b text-left text-sm font-medium">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.length > 0 ? (
                            products.map((product, index) => (
                                <tr key={product.id} className="hover:bg-gray-100 transition duration-200">
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{product.id}</td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{product.name}</td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">
                                        {product.thumbnail && (
                                            <img src={product.thumbnail} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                        )}
                                    </td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{product.brand_name}</td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{product.pricesale}</td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{product.priceroot}</td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{product.pricebuy}</td> 
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{product.description}</td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{product.category_name}</td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{product.qty}</td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{product.slug}</td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">{product.content}</td>
                                    <td className="px-4 py-4 border-b text-sm text-gray-900">
                                        <Link
                                            to={`/product/edit/${product.id}`}
                                            className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                                            onClick={() => handleEdit(product.id)}
                                        >
                                            <FaEdit className="inline" />
                                        </Link>
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <FaTrash className="inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13" className="px-4 py-4 text-center text-gray-500">Không có sản phẩm nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Product;
