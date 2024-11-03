import Api from "../Api/Api"

const ProductSaleService = {
    getList: async () => {
        return await Api.get('productsale')
    },
    getId: async (id) => {
        return await Api.get(`productsale/show/${id}`);
    },
    update: async (id, productsale) => {
        return await Api.post(`productsale/update/${id}`, productsale); // Sử dụng POST thay vì PUT
    },

}
export default ProductSaleService