import Api from "../Api/Api";

const UserService = {
    getList: async () => {
        return await Api.get('user');
    }
};

export default UserService;