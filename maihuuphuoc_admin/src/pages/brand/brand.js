import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import BrandService from '../../Service/BrandService';
import { ApiImages } from '../../Api/ApiImages';
import { Link } from 'react-router-dom';

const Brand = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const result = await BrandService.getList();
        setBrands(result.brands);
      } catch (error) {
        console.error('Lỗi khi tải danh sách thương hiệu:', error);
        alert('Không thể tải danh sách thương hiệu. Vui lòng kiểm tra lại kết nối hoặc thử lại sau.');
      }
    };

    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu với ID: ${id}?`)) {
      try {
        await BrandService.delete(id);
        setBrands(brands.filter((brand) => brand.id !== id));
        alert('Xóa thương hiệu thành công! Đã chuyển vào thùng rác.');
      } catch (error) {
        console.error('Lỗi khi xóa thương hiệu:', error);
        alert('Có lỗi xảy ra khi xóa thương hiệu.');
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // Đổi trạng thái
    try {
      await BrandService.updateStatus(id, newStatus); // Gọi phương thức cập nhật trạng thái
      setBrands(brands.map(brand => (brand.id === id ? { ...brand, status: newStatus } : brand)));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Không thể cập nhật trạng thái. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý thương hiệu</h1>
          <Link
            to="/brand/add"
            className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <IoMdAddCircleOutline size={20} />
            Thêm Thương Hiệu
          </Link>
        </div>

        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-800">STT</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-800">ID</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-800">Tên</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-800">Slug</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-800">Mô tả</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-800">Hình ảnh</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-800">Trạng thái</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-800">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {brands.length > 0 ? (
              brands.map((brand, index) => (
                <tr key={brand.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">{index + 1}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">{brand.id}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">{brand.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">{brand.slug}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">{brand.description}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                    {brand.thumbnail && (
                      <img
                        src={`${ApiImages}/images/brand/${brand.thumbnail}`}
                        alt={brand.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={brand.status === 1}
                        onChange={() => handleStatusChange(brand.id, brand.status)}
                        className="hidden"
                      />
                      <div className={`w-12 h-6 rounded-full ${brand.status === 1 ? 'bg-green-500' : 'bg-red-500'} relative`}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md absolute transition-transform ${brand.status === 1 ? 'transform translate-x-6' : 'transform translate-x-0'}`}></div>
                      </div>
                    </label>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800 flex gap-2">
                    <Link
                      to={`/brand/edit/${brand.id}`}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Chỉnh sửa"
                    >
                      <FaEdit size={18} />
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => handleDelete(brand.id)}
                      title="Xóa"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  Không có thương hiệu nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Brand;
