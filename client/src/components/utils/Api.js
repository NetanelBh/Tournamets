import axios from "axios";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const API = axios.create({
  baseURL: SERVER_URI,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise = null;

API.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = (async () => {
          try {
            const res = await API.post("/auth/refresh");
            sessionStorage.setItem("token", res.data.token);
          } catch (err) {
            sessionStorage.removeItem("token");
            window.location.href = "/login";
            throw err;
          } finally {
            isRefreshing = false;
          }
        })();
      }

      // wait for refresh to finish
      await refreshPromise;

      // attach the new token
      config.headers.Authorization = `Bearer ${sessionStorage.getItem("token")}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
