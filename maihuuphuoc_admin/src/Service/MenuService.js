import Api from "../Api/Api";

const MenuService = {
    // Lấy danh sách menu
    getList: async () => {
        try {
            const response = await Api.get('menu');
            console.log('API response:', response);
            if (response && response.menu) {
                return response.menu;
            } else {
                console.error('Dữ liệu không hợp lệ từ API:', response);
                return [];
            }
        } catch (error) {
            console.error('Error fetching menu data:', error);
            return [];
        }
    },

    // Lấy thông tin chi tiết của menu theo ID
    getId: async (id) => {
        try {
            const response = await Api.get(`menu/show/${id}`);
            return response.menu || null;
        } catch (error) {
            console.error('Error fetching menu by ID:', error);
            return null;
        }
    },

    // Thêm mới menu
    add: async (menuData) => {
        try {
            const response = await Api.post('menu/store', menuData);
            return response;
        } catch (error) {
            console.error('Error adding menu:', error);
            return { status: false, message: 'Thêm menu thất bại' };
        }
    },

    // Cập nhật menu
    update: async (id, menuData) => {
        try {
            const response = await Api.post(`menu/update/${id}`, menuData);
            return response;
        } catch (error) {
            console.error('Error updating menu:', error);
            return { status: false, message: 'Cập nhật menu thất bại' };
        }
    },

    // Thay đổi trạng thái của menu (active/inactive)
    updateStatus: async (id, status) => {
        return await Api.put(`menu/update/status/${id}`, { status });
    },


    // Xóa menu (thực hiện thay đổi trạng thái thành inactive)
    delete: async (id) => {
        try {
            const response = await Api.get(`menu/delete/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting menu:', error);
            return { status: false, message: 'Xóa menu thất bại' };
        }
    },

    // Phục hồi menu đã xóa
    restore: async (id) => {
        try {
            const response = await Api.get(`menu/restore/${id}`);
            return response;
        } catch (error) {
            console.error('Error restoring menu:', error);
            return { status: false, message: 'Phục hồi menu thất bại' };
        }
    },

    // Xóa menu vĩnh viễn
    destroy: async (id) => {
        try {
            const response = await Api.delete(`menu/destroy/${id}`);
            return response;
        } catch (error) {
            console.error('Error destroying menu:', error);
            return { status: false, message: 'Xóa menu vĩnh viễn thất bại' };
        }
    },
    getDeleted: async () => {
        return await Api.get('menu/trash');
    },
};

export default MenuService;
