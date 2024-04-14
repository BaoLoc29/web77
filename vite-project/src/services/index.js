import axios from "axios"
import { API_URL } from "../config"
import { getTokenFromLocalstorage } from '../utils/localstorage'

const axiosInstance = axios.create({
    baseURL: API_URL
})

const axiosInstanceAuth = axios.create({
    baseURL: API_URL
})

axiosInstanceAuth.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${getTokenFromLocalstorage()}`
    return config
})
export {
    axiosInstance,
    axiosInstanceAuth
}