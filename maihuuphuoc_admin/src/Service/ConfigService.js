import Api from "../Api/Api";

const ConfigService = {
    getList: async () => {
        return await Api.get('config');
    },
    getId: async (id) => {
        return await Api.get(`config/show/${id}`);
    },
    add: async (config) => {
        return await Api.post('config/store', config);
    },
    // Sửa đổi hàm update
    update: async (id, config) => {
        return await Api.post(`config/update/${id}`, config);
    },
    updateStatus: async (id, status) => {
        return await Api.put(`config/update/status/${id}`, { status });
    },
    restore: async (id) => {
        return await Api.get(`config/restore/${id}`); 
    },
    getDeleted: async () => {
        return await Api.get('config/trash');
    }
}

export default ConfigService;
