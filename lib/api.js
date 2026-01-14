import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pure-bd-mart-backend.vercel.app/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token from NextAuth session
api.interceptors.request.use(
  async (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      try {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        } else {
          console.warn("No access token found in session for request:", config.url);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors - be less verbose during SSR
    if (error.response?.status === 401) {
      // Token expired or invalid - NextAuth will handle re-authentication
      if (typeof window !== 'undefined') {
        console.warn("Authentication error - session may have expired");
      }
    } else if (error.response?.status === 404) {
      // Only log 404s for important endpoints, not settings
      if (typeof window !== 'undefined' && !error.config?.url?.includes('/settings')) {
        console.warn(`API endpoint not found: ${error.config?.url}`);
      }
    } else if (error.response?.status >= 500) {
      if (typeof window !== 'undefined') {
        console.error(`Server error: ${error.response?.status} - ${error.config?.url}`);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
