// apiConfig.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// сразу ставим токен из localStorage
const token = localStorage.getItem("accessToken");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
