import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5276/api",
    headers: { "ngrok-skip-browser-warning": "true" }
});

export default api;