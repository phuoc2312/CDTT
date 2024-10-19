import Api from "../Api/Api";

const BannerService = {
    // Lấy danh sách các banner đang hoạt động
    getList: async () => {
        return await Api.get('banner');
    },

    // Lấy thông tin chi tiết của một banner theo id
    getId: async (id) => {
        return await Api.get(`banner/show/${id}`);
    },

    // Thêm một banner mới
    add: async (banner) => {
        console.log('Data to be sent:', banner);
        const response = await Api.post('banner/store', banner);
        console.log('Response from API:', response);
        return response.data;
    },

    // Cập nhật thông tin banner theo id
    update: async (id, banner) => {
        console.log('Data to be updated:', banner);  // Debug log
        return await Api.post(`banner/update/${id}`, banner);
    },

    // Xóa hoàn toàn banner (chuyển trạng thái thành 2)
    delete: async (id) => {
        return await Api.delete(`banner/destroy/${id}`);
    },

    // Cập nhật trạng thái của banner (bật/tắt)
    updateStatus: async (id, status) => {
        console.log('Updating status to:', status);  // Debug log
        return await Api.put(`banner/update/status/${id}`, { status });
    },

    // Lấy danh sách các banner đã bị xóa (trong thùng rác)
    getDeleted: async () => {
        return await Api.get('banner/trash');
    },
    restore: async (id) => {
        return await Api.get(`banner/restore/${id}`);
    },
    forceDelete: async (id) => {
        return await Api.delete(`banner/forceDelete/${id}`);
    },
};

export default BannerService;
