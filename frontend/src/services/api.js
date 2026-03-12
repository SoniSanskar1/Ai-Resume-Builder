import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

// Axios instance with baseURL
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Ensure cookies are sent if needed
  timeout: 15000, // Increased timeout to 15 seconds
  maxContentLength: Infinity, // Allow large responses
  maxBodyLength: Infinity, // Allow large request bodies
  // Disable chunked encoding if supported by the server
   // Force non-chunked response
});

// Automatically attach JWT token from localStorage
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request config:", config); // Log request details
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh and response errors with retries
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response); // Log successful response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error("Response error details:", {
      message: error.message,
      code: error.code,
      response: error.response ? error.response.data : null,
    });
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("Retrying due to connection abort...");
      return api(originalRequest); // Retry once on connection abort
    }
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = localStorage.getItem("token");
      try {
        const newToken = await refreshToken(token);
        if (newToken) {
          localStorage.setItem("token", newToken);
          api.defaults.headers.Authorization = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Register API
export const registerUser = async (userData) => {
  return api.post("/auth/register", userData).then((res) => res.data);
};

// Login API
export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data.token;
};

// Refresh Token API
export const refreshToken = async (token) => {
  try {
    const response = await api.post("/refresh-token", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.token;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

// Resume Creation API with detailed logging
export const createResume = async (resumeData) => {
  try {
    console.log("Sending resume data:", resumeData); // Log sent data
    const response = await api.post("/resumes", resumeData, {
      headers: { 'Content-Type': 'application/json', 'Accept-Encoding': 'identity' }, // Force JSON and non-chunked
    });
    console.log("Resume creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Resume creation error details:", {
      message: error.message,
      code: error.code,
      response: error.response ? error.response.data : null,
    });
    throw new Error(error.response?.data?.message || error.message || 'Network error occurred');
  }
};

export default api;
