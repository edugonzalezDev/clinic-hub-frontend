import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? ""; // "" en dev -> rutas relativas

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// interceptores opcionales
apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    // centralizar manejo de errores si querés
    return Promise.reject(err);
  }
);
