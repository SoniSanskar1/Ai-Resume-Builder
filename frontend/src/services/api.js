import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Axios instance with baseURL
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

// Attach JWT token if available
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    debugger;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// ===================== Existing Exports ===================== //
export const loginUser = (credentials) => api.post("/auth/login", credentials);
export const registerUser = (data) => api.post("/auth/register", data);
export const refreshToken = () => api.post("/auth/refresh-token");
export const createResume = (data) => api.post("/resume", data);

// ✅ New function to send chat messages
export const createChatMessage = (message) => {
  return api.post("/chat", { message });
};

export default api;
