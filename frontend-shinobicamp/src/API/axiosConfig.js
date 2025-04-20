import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Create axios instance with base URL from environment variables
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Create public API client (doesn't require authentication)
const publicApiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  response => response,
  async error => {
    // Check if error is due to unauthenticated user (401)
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();

      // If user was previously authenticated, try to refresh session
      if (authStore.isAuthenticated) {
        try {
          // Attempt to refresh the session by calling the attempt method
          await authStore.attempt();

          // If successful, retry the original request
          const config = error.config;
          return apiClient(config);
        } catch (refreshError) {
          console.error('Session refresh failed:', refreshError);
          // If refresh fails, log out and redirect to login
          await authStore.logout();
          return Promise.reject(error);
        }
      }
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

export { apiClient, publicApiClient };
