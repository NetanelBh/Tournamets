import axios from "axios";

// Axios base url define to use it when send requests to backend
const API = axios.create({
	baseURL: "http://localhost:3000",
	withCredentials: true,
});

// optional: attach token interceptor if needed
API.interceptors.request.use((config) => {
	const token = sessionStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default API;
