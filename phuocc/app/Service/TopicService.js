import Api from "../Api/Api";

const TopicService = {
    // Fetch all active topics
    getList: async () => {
        return await Api.get('topic');
    },
    // Fetch a single topic by ID
    getId: async (id) => {
        return await Api.get(`topic/show/${id}`);
    },
    // Fetch topics in the trash (with status 2)
    getListTrash: async () => {
        return await Api.get('topic/trash');
    },
    // Add a new topic
    add: async (topic) => {
        return await Api.post('topic/store', topic);
    },
    // Update an existing topic
    update: async (id, topic) => {
        return await Api.post(`topic/update/${id}`, topic); // Using POST instead of PUT
    },
    // Move a topic to the trash
    delete: async (id) => {
        return await Api.get(`topic/delete/${id}`);
    },

    // Permanently delete a topic
    destroy: async (id) => {
        return await Api.delete(`topic/destroy/${id}`);
    },
    // Restore a topic from trash
    restore: async (id) => {
        return await Api.get(`topic/restore/${id}`);
    },
    getDeleted: async () => {
        return await Api.get('topic/trash');
    },
};

export default TopicService;
