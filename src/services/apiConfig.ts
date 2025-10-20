import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("accessToken");
  }
};

const token = localStorage.getItem("accessToken");
if (token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}
