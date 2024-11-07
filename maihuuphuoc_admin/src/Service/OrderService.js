import Api from "../Api/Api";

const OrderService = {
    getList: async () => {
        return await Api.get('order');
    },
    show: async (id) => {
        return await Api.get(`order/show/${id}`);
    },
    add: async (order) => {
        return await Api.post('order/store', order);
    },
    delete: async (id) => {
        return await Api.get(`order/delete/${id}`);
    },
    updateStatus: async (id, status) => {
        return await Api.put(`order/update/status/${id}`, { status });
    },
    restore: async (id) => {
        return await Api.get(`order/restore/${id}`);
    },
    getDeleted: async () => {
        return await Api.get('order/trash');
    },
    destroy: async (id) => {
        return await Api.delete(`order/destroy/${id}`); // Sử dụng DELETE cho xóa vĩnh viễn
    },

}

export default OrderService;
