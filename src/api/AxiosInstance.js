import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://event-management-backend-h5tn.onrender.com/api",
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosInstance;
