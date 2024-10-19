import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import ProductStoreService from '../../Service/ProductStoreService'

export default function EditProductStore() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productStore, setProductStore] = useState({
        qty: '',
        priceroot: '',
        // Add more fields here if necessary
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchProductStore = async () => {
            try {
                const response = await ProductStoreService.getId(id);
                const data = response;
                // Adjust based on your API response structure
                if (data) {
                    setProductStore({
                        qty: data.qty || '',
                        priceroot: data.priceroot || '',
                        // Initialize more fields if added
                    });
                } else {
                    throw new Error('Không tìm thấy thông tin sản phẩm trong kho');
                }
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm trong kho:", err);
                setError('Không tải được thông tin sản phẩm trong kho.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductStore();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductStore(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (productStore.qty === '') {
            errors.qty = 'Vui lòng nhập số lượng.';
        } else if (!Number.isInteger(Number(productStore.qty)) || Number(productStore.qty) < 0) {
            errors.qty = 'Số lượng phải là một số nguyên hợp lệ và không âm.';
        }

        if (productStore.priceroot === '') {
            errors.priceroot = 'Vui lòng nhập giá gốc.';
        } else if (isNaN(productStore.priceroot) || Number(productStore.priceroot) < 0) {
            errors.priceroot = 'Giá gốc phải là một số hợp lệ và không âm.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateProductStore = async (e) => {
        e.preventDefault();

        // Reset errors
        setError('');
        setFormErrors({});

        // Validate form
        if (!validateForm()) {
            return;
        }

        const formData = {
            qty: productStore.qty,
            priceroot: productStore.priceroot,
            // Add more fields here if necessary
        };

        try {
            await ProductStoreService.update(id, formData);
            navigate('/productstore'); // Adjust the navigation path as needed
        } catch (err) {
            console.error("Lỗi khi cập nhật sản phẩm trong kho:", err.response ? err.response.data : err.message);
            setError('Cập nhật sản phẩm trong kho không thành công.');
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Chỉnh Sửa Sản Phẩm Trong Kho</h2>
            <form onSubmit={handleUpdateProductStore} className="space-y-4">
                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Số Lượng:</label>
                    <input
                        type="number"
                        name="qty"
                        value={productStore.qty}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="1"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.qty && <div className="text-red-500 mt-1">{formErrors.qty}</div>}
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Giá Gốc:</label>
                    <input
                        type="number"
                        name="priceroot"
                        value={productStore.priceroot}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.priceroot && <div className="text-red-500 mt-1">{formErrors.priceroot}</div>}
                </div>

                {/* Add more form fields here if necessary */}

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                >
                    <FaEdit className="mr-2" /> Cập Nhật
                </button>
            </form>
        </div>
    );
}
