import axios from "axios";

// Axios base url define to use it when send requests to backend
const API = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

export default API;