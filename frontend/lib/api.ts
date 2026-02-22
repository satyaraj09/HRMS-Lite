import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://127.0.0.1:8000/api",
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    throw err;
  },
);

export default api;
