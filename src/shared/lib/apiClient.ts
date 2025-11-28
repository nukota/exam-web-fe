import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { auth } from "./firebase";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Custom API Error class
export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - automatically add Firebase token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get current Firebase user and token
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting Firebase token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors consistently
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      throw new ApiError(
        "Network error - please check your connection",
        0,
        error
      );
    }

    const status = error.response.status;
    const data = error.response.data;

    // Handle specific error codes
    switch (status) {
      case 401:
        // Unauthorized - token expired or invalid
        console.error("Unauthorized - please sign in again");
        // Optionally redirect to login
        // window.location.href = '/signin';
        throw new ApiError("Unauthorized - please sign in again", 401, data);

      case 403:
        // Forbidden - no permission
        throw new ApiError(
          "You do not have permission to perform this action",
          403,
          data
        );

      case 404:
        // Not found
        throw new ApiError("Resource not found", 404, data);

      case 422:
        // Validation error
        throw new ApiError(
          (data as any)?.message || "Validation error",
          422,
          data
        );

      case 500:
        // Server error
        throw new ApiError("Server error - please try again later", 500, data);

      default:
        throw new ApiError(
          (data as any)?.message || `HTTP ${status}: ${error.message}`,
          status,
          data
        );
    }
  }
);

// Helper functions for different HTTP methods
export const api = {
  get: <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get<T>(endpoint, config).then((res) => res.data);
  },

  post: <T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiClient.post<T>(endpoint, data, config).then((res) => res.data);
  },

  put: <T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiClient.put<T>(endpoint, data, config).then((res) => res.data);
  },

  patch: <T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiClient.patch<T>(endpoint, data, config).then((res) => res.data);
  },

  delete: <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete<T>(endpoint, config).then((res) => res.data);
  },
};
