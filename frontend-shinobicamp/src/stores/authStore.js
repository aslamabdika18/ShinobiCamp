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
      console.error('Login failed:', error);
      return 'invalid credentials';
    }
  };

  const register = async (credentials) => {
    await axios.get('/sanctum/csrf-cookie'); // Initialize CSRF protection
    try {
      const response = await axios.post('/register', credentials);
      // Setelah registrasi berhasil, kita tidak perlu login otomatis
      // Biarkan user login manual untuk memastikan kredensial benar
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(' ');
        throw new Error(errorMessages);
      }
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout'); // Call logout endpoint
      setUser({});
      setRoles([]); // Reset roles
      setAuthenticated(false); // Reset authentication state
      // Pastikan semua state direset dengan benar
      isAuthResolved.value = true;
      return null; // Return null jika berhasil
    } catch (error) {
      handleError(error, 'Logout failed. Please try again.');
      throw error;
    }
  };

  const attempt = async () => {
    try {
      const response = await axios.get('/api/user'); // Fetch authenticated user data
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setRoles(response.data.roles || []); // Assume roles are included in the response
        setAuthenticated(true);
      } else {
        // Jika tidak ada data user yang valid, reset state
        setUser({});
        setRoles([]);
        setAuthenticated(false);
      }
    } catch {
      // Jangan tampilkan error untuk pengecekan autentikasi yang gagal
      // karena ini adalah operasi background yang normal
      console.log('Authentication check: User not authenticated');
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
