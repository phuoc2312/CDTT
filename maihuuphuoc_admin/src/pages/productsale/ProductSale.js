import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';


import ProductSaleService from '../../Service/ProductSaleService';
import { Link } from 'react-router-dom';


function ProductSale() {
    const [productsale, setProductsale] = useState([]);
    useEffect(() => {

        (async () => {
            const result = await ProductSaleService.getList();
            setProductsale(result);
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
    console.log(productsale)
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
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Giá Sale</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Ngày bắt đầu</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Ngày kết thúc</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsale && productsale.length > 0 && productsale.map((productsale, index) => (
                            <tr key={productsale.id}>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{index + 1}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{productsale.id}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{productsale.name}</td>
                                <td className="h-10 w-10 border-b text-sm text-gray-900">
                                    {productsale.thumbnail && (
                                        <>
                                            <img src={productsale.thumbnail} alt={productsale.name} className="w-16 h-16 object-cover" />
                                            {/* Debugging */}

                                        </>
                                    )}
                                </td>
                               
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{productsale.pricesale}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{productsale.datebegin}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">{productsale.dateend}</td>
                                <td className="px-6 py-4 border-b text-sm text-gray-900">
                                    <Link
                                        to={`/productsale/edit/${productsale.id}`}
                                        className="mr-2 px-4 py-2 text-blue-500 hover:text-blue-700"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        className="px-4 py-2 text-red-500 hover:text-red-700"
                                        onClick={() => handleDelete(productsale.id)}
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

export default ProductSale;
