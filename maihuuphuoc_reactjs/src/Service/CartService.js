import Api from "../Api/Api";

const CartService = {
    // Lấy danh sách sản phẩm trong giỏ hàng
    getList: async (userId) => {
        return await Api.get(`cart/show/${userId}`);
    },


    // Thêm một sản phẩm vào giỏ hàng
    add: async (cartItem) => {
        console.log('Data to be sent:', cartItem);  // Debug log
        const response = await Api.post('cart/store', cartItem);
        console.log('Response from API:', response);  // Debug log
        return response.data;
    },
    

    // Cập nhật sản phẩm trong giỏ hàng
    update: async (id, quantity) => {
        console.log('Data to be updated:', { quantity });  // Debug log
        return await Api.put(`cart/update/${id}`, { qty: quantity });
    },

    // Xóa sản phẩm khỏi giỏ hàng
    delete: async (id) => {
        return await Api.delete(`/cart/destroy/${id}`); // Sửa thành /destroy/${id}
    },
    
    

    // Xóa toàn bộ giỏ hàng (nếu cần)
    // clearCart: async (userId) => {
    //     return await Api.delete(`cart/clear/${userId}`);
    // },
};

export default CartService;
