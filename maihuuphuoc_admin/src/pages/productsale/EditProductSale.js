import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import ProductSaleService from '../../Service/ProductSaleService';


export default function EditProductSale() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productSale, setProductSale] = useState({
        pricesale: '',
        datebegin: '',
        dateend: '',
        // Add more fields here if necessary
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchProductSale = async () => {
            try {
                const response = await ProductSaleService.getId(id);
                const data = response;
                if (data) {
                    setProductSale({
                        salePrice: data.pricesale || '',
                        startDate: data.datebegin || '',
                        endDate: data.dateend || '',
                        // Initialize more fields if added
                    });
                } else {
                    throw new Error('Không tìm thấy thông tin khuyến mãi sản phẩm');
                }
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu khuyến mãi sản phẩm:", err);
                setError('Không tải được thông tin khuyến mãi sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductSale();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductSale(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!productSale.pricesale) {
            errors.pricesale = 'Vui lòng nhập giá sale.';
        } else if (isNaN(productSale.pricesale) || Number(productSale.pricesale) < 0) {
            errors.pricesale = 'Giá sale phải là một số hợp lệ và không âm.';
        }

        if (!productSale.datebegin) {
            errors.datebegin = 'Vui lòng chọn ngày bắt đầu.';
        }

        if (!productSale.dateend) {
            errors.dateend = 'Vui lòng chọn ngày kết thúc.';
        }

        if (productSale.datebegin && productSale.dateend) {
            const start = new Date(productSale.datebegin);
            const end = new Date(productSale.dateend);
            if (start > end) {
                errors.dateend = 'Ngày kết thúc phải sau ngày bắt đầu.';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateProductSale = async (e) => {
        e.preventDefault();

        // Reset errors
        setError('');
        setFormErrors({});

        // Validate form
        if (!validateForm()) {
            return;
        }

        const formData = {
            pricesale: productSale.pricesale,
            datebegin: productSale.datebegin,
            dateend: productSale.dateend,
            // Add more fields here if necessary
        };

        try {
            await ProductSaleService.update(id, formData);
            navigate('/productsale'); // Adjust the navigation path as needed
        } catch (err) {
            console.error("Lỗi khi cập nhật khuyến mãi sản phẩm:", err.response ? err.response.data : err.message);
            setError('Cập nhật khuyến mãi sản phẩm không thành công.');
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Chỉnh Sửa Khuyến Mãi Sản Phẩm</h2>
            <form onSubmit={handleUpdateProductSale} className="space-y-4">
                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Giá Sale:</label>
                    <input
                        type="number"
                        name="pricesale"
                        value={productSale.pricesale}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.pricesale && <div className="text-red-500 mt-1">{formErrors.pricesale}</div>}
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Ngày Bắt Đầu:</label>
                    <input
                        type="date"
                        name="datebegin"
                        value={productSale.datebegin}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.datebegin && <div className="text-red-500 mt-1">{formErrors.datebegin}</div>}
                </div>

                <div className="form-group">
                    <label className="block text-gray-600 mb-1">Ngày Kết Thúc:</label>
                    <input
                        type="date"
                        name="dateend"
                        value={productSale.dateend}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.dateend && <div className="text-red-500 mt-1">{formErrors.dateend}</div>}
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
