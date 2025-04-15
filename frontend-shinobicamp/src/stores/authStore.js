import { defineStore } from 'pinia';
import { handleError } from '@/utils/errorHandler';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref({});
  const authenticated = ref(false);
  const isAuthResolved = ref(false);
  const roles = ref([]); // Tambahkan state untuk roles

  // Getters
  const isAuthenticated = computed(() => authenticated.value);
  const currentUser = computed(() => user.value);
  const hasRole = (role) => roles.value.includes(role); // Check if user has a specific role
  const hasAnyRole = (roleList) => roleList.some((role) => roles.value.includes(role)); // Check for multiple roles

  // Mutations
  const setAuthenticated = (value) => {
    authenticated.value = value;
  };

  const setUser = (userData) => {
    user.value = userData;
  };

  const setRoles = (roleData) => {
    roles.value = Array.isArray(roleData) ? roleData : [roleData]; // Ensure roles is always an array
  };

  // Actions
  const login = async (credentials) => {
    await axios.get('/sanctum/csrf-cookie'); // Initialize CSRF protection
    try {
      await axios.post('/login', credentials);
      await attempt(); // Fetch user data after login
      return null;
    } catch (error) {
      handleError(error, 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (credentials) => {
    await axios.get('/sanctum/csrf-cookie'); // Initialize CSRF protection
    try {
      await axios.post('/register', credentials);
      await attempt(); // Fetch user data after registration
      return null;
    } catch (error) {
      handleError(error, 'Registration failed. Please check your credentials.');
      throw error;
    } finally {
      isAuthResolved.value = true;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout'); // Call logout endpoint
      setUser({});
      setRoles([]); // Reset roles
      setAuthenticated(false); // Reset authentication state
    } catch (error) {
      handleError(error, 'Logout failed. Please try again.');
      throw error;
    }
  };

  const attempt = async () => {
    try {
      const response = await axios.get('/api/user'); // Fetch authenticated user data
      setUser(response.data.user);
      setRoles(response.data.roles || []); // Assume roles are included in the response
      setAuthenticated(true);
    } catch (error) {
      handleError(error, 'Authentication check failed.');
      setUser({});
      setRoles([]);
      setAuthenticated(false);
    } finally {
      isAuthResolved.value = true; // Mark authentication attempt as resolved
    }
  };

  // Expose state, getters, and actions
  return {
    currentUser,
    isAuthenticated,
    isAuthResolved,
    roles,
    hasRole,
    hasAnyRole,
    login,
    register,
    logout,
    attempt,
  };
});
