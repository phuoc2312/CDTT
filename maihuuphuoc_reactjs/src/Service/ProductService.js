import axios from "axios";
import Api from "../Api/Api";

const ProductService = {
    // Lấy danh sách sản phẩm
    getList: async () => {
        try {
            return await Api.get('product'); // Kiểm tra endpoint
        } catch (error) {
            console.error("Error fetching product list:", error);
            throw error;
        }
    },

    // Lấy sản phẩm theo ID
    getId: async (id) => {
        try {
            const response = await Api.get(`product/show/${id}`);
            console.log("API response:", response); // In kết quả trả về từ API
            return response;
        } catch (error) {
            console.error(`Error fetching product with ID ${id}:`, error);
            throw error;
        }
    },

    // Thêm sản phẩm mới
    add: async (product) => {
        try {
            return await Api.post('product/store', product);
        } catch (error) {
            console.error("Error adding new product:", error);
            throw error;
        }
    },

    // Cập nhật thông tin sản phẩm theo ID
    update: async (id, product) => {
        try {
            return await Api.post(`product/update/${id}`, product); // Sử dụng PUT thay vì POST
        } catch (error) {
            console.error(`Error updating product with ID ${id}:`, error);
            throw error;
        }
    },

    // Xóa sản phẩm
    delete: async (id) => {
        try {
            return await Api.get(`/delete/${id}`); // Đảm bảo API.delete sử dụng phương thức DELETE
        } catch (error) {
            console.error(`Error deleting product with ID ${id}:`, error);
            throw error;
        }
    },

    // Cập nhật trạng thái sản phẩm
    updateStatus: async (id) => {
        try {
            return await Api.patch(`product/status/${id}`); // Sử dụng PATCH để cập nhật trạng thái
        } catch (error) {
            console.error(`Error updating status for product with ID ${id}:`, error);
            throw error;
        }
    },

    // Khôi phục sản phẩm đã xóa
    restore: async (id) => {
        try {
            return await Api.post(`product/restore/${id}`); // Sử dụng POST để khôi phục
        } catch (error) {
            console.error(`Error restoring product with ID ${id}:`, error);
            throw error;
        }
    },

    // Lấy danh sách sản phẩm đã xóa
    getDeleted: async () => {
        try {
            return await Api.get('product/trash');
        } catch (error) {
            console.error("Error fetching deleted product list:", error);
            throw error;
        }
    },
    // Người dùng
    product_new: async (limit) => {
        return await Api.get(`product_new/${limit}`);
    },

    product_sale: async (limit) => {
        return await Api.get(`product_sale/${limit}`);
    },
    product_bestseller: async (limit) => {
        return await Api.get(`product_bestseller/${limit}`);
    },
    getProductsByCategory: async (categoryId) => {
        return await Api.get(`product/category/${categoryId}`);
    },
    getProductsByBrand: async (brandId) => {
        return await Api.get(`product/brand/${brandId}`);
    },
}

export default ProductService;
