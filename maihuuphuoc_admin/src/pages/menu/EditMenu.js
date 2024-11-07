import React, { useState, useEffect } from 'react';
import MenuService from '../../Service/MenuService';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const Menu = () => {
    const [menu, setMenu] = useState({
        id: null,
        name: '',
        link: '',
        type: 'mainmenu',
        status: 1,
    });

    const [menus, setMenus] = useState([]); // Danh sách các menu
    const [isFormVisible, setFormVisible] = useState(false); // Trạng thái form thêm menu

    // Lấy danh sách menu từ API
    const fetchMenus = async () => {
        try {
            const data = await MenuService.getList();
            if (data.length > 0) {
                setMenus(data);
            } else {
                alert('Không thể tải danh sách menu');
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu menu:', error);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Nếu là status thì chuyển giá trị thành kiểu số
        setMenu((prevMenu) => ({
            ...prevMenu,
            [name]: name === 'status' ? parseInt(value) : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (menu.id) {
            // Nếu menu đã có id thì thực hiện cập nhật
            const response = await MenuService.update(menu.id, menu);
            if (response && response.status) {
                alert('Menu đã được cập nhật thành công');
                fetchMenus(); // Cập nhật lại danh sách menu
                setFormVisible(false); // Đóng form
                setMenu({ id: null, name: '', link: '', type: 'mainmenu', status: 1 }); // Reset form
            } else {
                alert('Có lỗi xảy ra khi cập nhật menu');
            }
        } else {
            // Nếu menu chưa có id, thực hiện thêm mới
            const response = await MenuService.add(menu);
            if (response && response.status) {
                alert('Menu đã được thêm thành công');
                fetchMenus(); // Cập nhật lại danh sách menu
                setFormVisible(false); // Đóng form
                setMenu({ id: null, name: '', link: '', type: 'mainmenu', status: 1 }); // Reset form
            } else {
                alert('Có lỗi xảy ra khi thêm menu');
            }
        }
    };
    

    const handleEdit = (menuItem) => {
        console.log(menuItem); // Kiểm tra xem thông tin menu đã chính xác chưa
        setMenu(menuItem); // Điền thông tin vào form để sửa
        setFormVisible(true); // Mở form để sửa
    };
    const handleDelete = async (menuId) => {
        const response = await MenuService.delete(menuId);
        if (response.status) {
            alert('Menu đã được xóa thành công');
            fetchMenus(); // Cập nhật lại danh sách menu
        } else {
            alert('Có lỗi xảy ra khi xóa menu');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Danh Sách Menu</h1>

            {/* Nút mở/đóng form */}
            <button
                onClick={() => setFormVisible(!isFormVisible)}
                className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mb-6"
            >
                {isFormVisible ? 'Đóng Form' : 'Mở Form'}
            </button>

            {/* Hiển thị form thêm/sửa menu */}
            {isFormVisible && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">{menu.id ? 'Sửa Menu' : 'Thêm Menu Mới'}</h2>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên Menu</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={menu.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link</label>
                        <input
                            type="text"
                            id="link"
                            name="link"
                            value={menu.link}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Loại</label>
                        <select
                            id="type"
                            name="type"
                            value={menu.type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                        >
                            <option value="mainmenu">Main Menu</option>
                            <option value="footermenu">Footer Menu</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Trạng Thái</label>
                        <select
                            id="status"
                            name="status"
                            value={menu.status}  // Đảm bảo giá trị status được cập nhật đúng
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                        >
                            <option value="1">Hoạt động</option>
                            <option value="0">Không hoạt động</option>
                        </select>
                    </div>


                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        {menu.id ? 'Cập Nhật' : 'Thêm'}
                    </button>
                </form>
            )}

            {/* Hiển thị danh sách menu */}
            <h2 className="text-xl font-semibold mb-4">Danh Sách Menu</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Tên Menu</th>
                            <th className="px-4 py-2 text-left">Link</th>
                            <th className="px-4 py-2 text-left">Loại</th>
                            <th className="px-4 py-2 text-left">Trạng Thái</th>
                            <th className="px-4 py-2 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menus.map((menuItem) => (
                            <tr key={menuItem.id}>
                                <td className="px-4 py-2">{menuItem.name}</td>
                                <td className="px-4 py-2">{menuItem.link}</td>
                                <td className="px-4 py-2">{menuItem.type}</td>
                                <td className="px-4 py-2">
                                    {menuItem.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleEdit(menuItem)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <FaEdit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(menuItem.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrashAlt size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Menu;
