import axios from "axios";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

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

API.interceptors.response.use(
	(res) => res,
	(error) => {
		if (error.response?.status === 401) {
			const code = error.response.data?.code;

			if (
				code === "SESSION_EXPIRED" ||
				code === "SESSION_INVALID" ||
				code === "NO_TOKEN"
			) {
				alert("לאחר 20 דקות ללא שימוש, יש לבצע כניסה מחדש");
				window.location.href = "/";
			}
		}

		return Promise.reject(error);
	}
);

export default API;
