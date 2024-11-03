import Api from "../Api/Api";

const ContactService = {
    // Lấy danh sách liên hệ
    getList: () => {
        return Api.get("/contact");
    },

    // Lấy danh sách liên hệ trong thùng rác
    getTrash: () => {
        return Api.get("/contact/trash");
    },

    // Lấy chi tiết một liên hệ
    getDetail: (id) => {
        return Api.get(`/contact/show/${id}`);
    },

    // Gửi phản hồi cho một liên hệ
    sendReply: (id, replyData) => {
        return Api.post(`/contact/reply/${id}`, replyData);
    },

    // Thay đổi trạng thái của liên hệ
    updateStatus: (id) => {
        return Api.get(`/contact/status/${id}`);
    },

    // Xóa liên hệ (chuyển vào thùng rác)
    deleteContact: (id) => {
        return Api.get(`/contact/delete/${id}`);
    },

    // Khôi phục liên hệ từ thùng rác
    restoreContact: (id) => {
        return Api.get(`/contact/restore/${id}`);
    },

    // Xóa vĩnh viễn liên hệ
    destroyContact: (id) => {
        return Api.delete(`/contact/destroy/${id}`);
    },

    // Tạo mới một liên hệ
    createContact: (post) => {
        return Api.post("/contact/store", post);
    }
};

export default ContactService;
