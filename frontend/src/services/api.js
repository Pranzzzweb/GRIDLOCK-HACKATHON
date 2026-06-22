import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const predictViolation = async (formData) => {
  const response = await api.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get("/api/stats");
  return response.data;
};

export default api;
