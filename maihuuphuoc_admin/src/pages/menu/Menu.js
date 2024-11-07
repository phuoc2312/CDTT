import React, { useState, useEffect } from 'react';
import MenuService from '../../Service/MenuService';
import { FaEdit, FaTrashAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Menu = () => {
    const [menu, setMenu] = useState({
        id: null,
        name: '',
        link: '',
        type: 'mainmenu',
        status: 1,
    });

    const [menus, setMenus] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false);

    // Fetch menu list from API
    const fetchMenus = async () => {
        try {
            const data = await MenuService.getList();
            console.log('Dữ liệu menu:', data); // Kiểm tra dữ liệu API trả về
            if (data && data.length > 0) {
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

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMenu((prevMenu) => ({
            ...prevMenu,
            [name]: name === 'status' ? parseInt(value) : value,
        }));
    };

    // Handle form submit for adding or updating menu
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (menu.id) {
                const response = await MenuService.update(menu.id, menu);
                if (response && response.status) {
                    alert('Menu đã được cập nhật thành công');
                    fetchMenus();
                    setFormVisible(false);
                    setMenu({ id: null, name: '', link: '', type: 'mainmenu', status: 1 });
                } else {
                    alert('Có lỗi xảy ra khi cập nhật menu');
                }
            } else {
                const response = await MenuService.add(menu);
                if (response && response.status) {
                    alert('Menu đã được thêm thành công');
                    fetchMenus();
                    setFormVisible(false);
                    setMenu({ id: null, name: '', link: '', type: 'mainmenu', status: 1 });
                } else {
                    alert('Có lỗi xảy ra khi thêm menu');
                }
            }
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    // Handle editing a menu
    const handleEdit = (menuItem) => {
        setMenu(menuItem);
        setFormVisible(true);
    };

    // Handle deleting a menu
    const handleDelete = async (menuId) => {
        try {
            const response = await MenuService.delete(menuId);
            if (response && response.status) {
                alert('Menu đã được xóa thành công');
                fetchMenus();
            } else {
                alert('Có lỗi xảy ra khi xóa menu');
            }
        } catch (error) {
            console.error('Lỗi khi xóa menu:', error);
            alert('Có lỗi xảy ra khi xóa menu');
        }
    };

    // Handle toggling the menu status
    const handleToggleStatus = async (menuItem) => {
        try {
            const updatedStatus = menuItem.status === 1 ? 0 : 1; // Toggle status between 1 (active) and 0 (inactive)
            const response = await MenuService.updateStatus(menuItem.id, { status: updatedStatus });

            if (response && response.status) {
                alert('Trạng thái đã được thay đổi');
                // Update the menu list with the new status
                setMenus((prevMenus) =>
                    prevMenus.map((item) =>
                        item.id === menuItem.id ? { ...item, status: updatedStatus } : item
                    )
                );
            } else {
                alert('Có lỗi xảy ra khi thay đổi trạng thái menu');
            }
        } catch (error) {
            console.error('Lỗi khi thay đổi trạng thái menu:', error);
            alert('Có lỗi xảy ra khi thay đổi trạng thái menu');
        }
    };



    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Danh Sách Menu</h1>

            <button
                onClick={() => setFormVisible(!isFormVisible)}
                className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mb-6"
            >
                {isFormVisible ? 'Đóng Form' : 'Mở Form'}
            </button>

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

                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        {menu.id ? 'Cập Nhật' : 'Thêm'}
                    </button>
                </form>
            )}

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
                                    <button onClick={() => handleToggleStatus(menuItem)}>
                                        {menuItem.status === 1 ? (
                                            <FaToggleOn size={20} className="text-green-500" />
                                        ) : (
                                            <FaToggleOff size={20} className="text-red-500" />
                                        )}
                                    </button>

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
