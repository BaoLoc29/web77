import { axiosInstance, axiosInstanceAuth } from "./index";

const login = ({ email, password }) => {
    return axiosInstance.post("/user/login", { email, password })
}
const signup = ({ name, email, password }) => {
    return axiosInstance.post("/user/signup", { name, email, password })
}

const getPagingUser = ({ pageSize, pageIndex }) => {
    return axiosInstanceAuth.get(`/user/get-paging-user?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}

const createUser = (data) => {
    return axiosInstanceAuth.post('/user/create-user', data);
}

export {
    login,
    signup,
    getPagingUser,
    createUser
}