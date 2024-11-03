import Api from "../Api/Api"; // Đoạn này giả sử bạn đã có một module để gọi API chung

const OrderService = {
    // Lấy danh sách đơn hàng
    async getOrders() {
        try {
            const response = await Api.get('/order');
            return response.data; // Trả về dữ liệu danh sách đơn hàng
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            throw error; // Ném lỗi lên để xử lý ở nơi gọi
        }
    },

    // Hiển thị một đơn hàng theo ID
    async getOrderById(id) {
        try {
            const response = await Api.get(`/order/show/${id}`);
            return response.data; // Trả về dữ liệu đơn hàng
        } catch (error) {
            console.error(`Lỗi khi lấy đơn hàng với ID ${id}:`, error);
            throw error;
        }
    },

    // Lấy danh sách đơn hàng trong thùng rác
    async getTrashOrders() {
        try {
            const response = await Api.get('/order/trash');
            return response.data; // Trả về danh sách đơn hàng trong thùng rác
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng trong thùng rác:", error);
            throw error;
        }
    },

    // Thay đổi trạng thái đơn hàng
    async changeOrderStatus(id, status) {
        try {
            const response = await Api.get(`/order/status/${id}`, { params: { status } });
            return response.data; // Trả về dữ liệu sau khi thay đổi trạng thái
        } catch (error) {
            console.error(`Lỗi khi thay đổi trạng thái đơn hàng với ID ${id}:`, error);
            throw error;
        }
    },

    // Tạo đơn hàng mới
    async createOrder(orderData) {
        try {
            const response = await Api.post('/order/store', orderData);
            return response.data; // Trả về dữ liệu đơn hàng mới tạo
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            throw error;
        }
    },
    
    // Xóa một đơn hàng theo ID
    async deleteOrder(id) {
        try {
            const response = await Api.delete(`/order/destroy/${id}`);
            return response.data; // Trả về dữ liệu sau khi xóa
        } catch (error) {
            console.error(`Lỗi khi xóa đơn hàng với ID ${id}:`, error);
            throw error;
        }
    },
};

export default OrderService;
