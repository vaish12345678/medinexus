import axios from "axios";

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export function errorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong."
  );
}

export default api;