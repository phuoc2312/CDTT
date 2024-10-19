import Api from "../Api/Api";

const BrandService = {
    getList: async () => {
        return await Api.get('brand');
    },
    getId: async (id) => {
        return await Api.get(`brand/show/${id}`);
    },
    add: async (brand) => {
        return await Api.post('brand/store', brand);
    },
    update: async (id, brand) => {
        return await Api.post(`brand/update/${id}`, brand);
    },
    delete: async (id) => {
        return await Api.delete(`brand/destroy/${id}`);
    },
    updateStatus: async (id, status) => {
        return await Api.put(`brand/update/status/${id}`, { status });
    },
    restore: async (id) => {
        return await Api.get(`brand/restore/${id}`);
    },
    getDeleted: async () => {
        return await Api.get('brand/trash');
    },
    forceDelete: async (id) => {
        return await Api.delete(`brand/forceDelete/${id}`);
    },
};


export default BrandService;
