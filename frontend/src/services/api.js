import axios from "axios";

const api = axios.create({

    baseURL: "https://localhost:5276/api"
});

export default api;