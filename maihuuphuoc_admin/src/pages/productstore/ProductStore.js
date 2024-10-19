import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';


import ProductSaleService from '../../Service/ProductSaleService';
import { Link } from 'react-router-dom';
import ProductStoreService from '../../Service/ProductStoreService';


function ProductStore() {
    const [productstore, setProductstore] = useState([]);
    useEffect(() => {

        (async () => {
            const result = await ProductStoreService.getList();
            setProductstore(result);
        })();
    }, []);
    // Hàm xử lý xóa
    const handleDelete = (id) => {
        alert(`Xóa sản phẩm với ID: ${id}`);
        // Logic xóa sản phẩm tại đây
    };

    // Hàm xử lý chỉnh sửa
    const handleEdit = (id) => {
        alert(`Chỉnh sửa sản phẩm với ID: ${id}`);
        // Logic chỉnh sửa sản phẩm tại đây
    };
    console.log(productstore)
    return (
        <div>
            <div className="w-full">
                <table id="example1" className="min-w-full bg-white border-collapse">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">STT</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Id</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Tên sản phẩm</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Hình ảnh</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Giá</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Số lượng</th>

                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Ngày nhập</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productstore && productstore.length > 0 && productstore.map((productstore, index) => (
                            <tr key={productstore.id}>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{index + 1}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{productstore.id}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{productstore.name}</td>
                                <td className="h-10 w-10 border-b text-sm text-gray-900">
                                    {productstore.thumbnail && (
                                        <>
                                            <img src={productstore.thumbnail} alt={productstore.name} className="w-16 h-16 object-cover" />
                                            {/* Debugging */}

                                        </>
                                    )}
                                </td>

                                <td className="px-6 py-4 border-b text-sm text-gray-900">{productstore.priceroot}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{productstore.qty}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{productstore.dateimport}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">
                                    <Link
                                        to={`/productstore/edit/${productstore.id}`}
                                        className="mr-2 px-4 py-2 text-blue-500 hover:text-blue-700"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        className="px-4 py-2 text-red-500 hover:text-red-700"
                                        onClick={() => handleDelete(productstore.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductStore;
