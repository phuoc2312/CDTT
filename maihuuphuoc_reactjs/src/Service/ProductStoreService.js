import Api from "../Api/Api"

const ProductStoreService = {
    getList: async () => {
        return await Api.get('productstore')
    },
    getId: async (id) => {
        return await Api.get(`productstore/show/${id}`);
    },
    update: async (id, productstore) => {
        return await Api.post(`productstore/update/${id}`, productstore); // Sử dụng POST thay vì PUT
    },

}
export default ProductStoreService