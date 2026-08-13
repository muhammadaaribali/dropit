import axios from "axios";

const api = axios.create({

    baseURL: "http://localhost:5276/api"
});

export default api;