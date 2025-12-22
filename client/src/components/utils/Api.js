import axios from "axios";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;
console.log(SERVER_URI);

// Axios base url define to use it when send requests to backend
const API = axios.create({
	baseURL: SERVER_URI,
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
