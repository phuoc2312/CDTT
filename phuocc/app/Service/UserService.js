import Api from "./../Api/Api"

const UserService = {
    getList: async () => {
        return await Api.get(`user`);
    },
    trash: async () => {
        return await Api.get(`user/trash`);
    },
    show: async (id) => {
        return await Api.get(`user/show/${id}`);
    },
    store: async (data) => {
        return await Api.post(`user/store`, data);
    },
    update: async (data, id) => {
        return await Api.post(`user/update/${id}`, data);
    },
    delete: async (id) => {
        return await Api.get(`user/delete/${id}`);
    },
    restore: async (id) => {
        return await Api.get(`user/restore/${id}`);
    },
    destroy: async (id) => {
        return await Api.delete(`user/destroy/${id}`);
    },

    register: async (data) => {
        return await Api.post(`user/register`, data);
    },

    login: async (data) => {
        return await Api.post(`user/login`, data);
    },
}
export default UserService