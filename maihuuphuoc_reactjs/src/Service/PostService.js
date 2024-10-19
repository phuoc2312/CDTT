import Api from "../Api/Api";

const PostService = {
    // Fetch all active posts
    getList: async () => {
        return await Api.get('post');
    },

    // Fetch a single post by ID
    getId: async (id) => {
        return await Api.get(`post/show/${id}`);
    },

    // Fetch posts in the trash
    getDeleted: async () => {
        return await Api.get('post/trash');
    },

    // Add a new post
    add: async (post) => {
        return await Api.post('post/store', post);
    },

    // Update an existing post by ID
    update: async (id, post) => {
        return await Api.post(`post/update/${id}`, post); // Sử dụng POST cho update theo route định nghĩa
    },

    // Move a post to the trash
    delete: async (id) => {
        return await Api.get(`post/delete/${id}`); // Sử dụng GET cho xóa mềm
    },

    // Restore a post from trash
    restore: async (id) => {
        return await Api.get(`post/restore/${id}`); // Sử dụng GET cho khôi phục
    },

    // Permanently delete a post
    destroy: async (id) => {
        return await Api.delete(`post/destroy/${id}`); // Sử dụng DELETE cho xóa vĩnh viễn
    },

    updateStatus: async (id, status) => {
        console.log('Updating status to:', status);  // Debug log
        return await Api.put(`post/update/status/${id}`, { status });
    },
};

export default PostService;
