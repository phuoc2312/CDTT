import Api from "../Api/Api"

const CategoryService = {
    getList: async () => {
        return await Api.get('category');
    },
    getId: async (id) => {
        return await Api.get(`category/show/${id}`);
    },
    add: async (category) => {
        return await Api.post('category/store', category);
    },
    update: async (id, category) => {
        return await Api.post(`category/update/${id}`, category);
    },
    delete: async (id) => {
        return await Api.get(`category/delete/${id}`); // Sửa thành GET
    },

    updateStatus: async (id, status) => {
        return await Api.put(`category/update/status/${id}`, { status });
    },
    restore: async (id) => {
        return await Api.get(`category/restore/${id}`);
    },
    getDeleted: async () => {
        return await Api.get('category/trash');
    },
    forceDelete: async (id) => {
        return await Api.delete(`category/forceDelete/${id}`);
    },

}

export default CategoryService;
