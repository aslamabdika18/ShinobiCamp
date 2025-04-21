import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import EventService from '@/API/eventService';
import { useAuthStore } from '@/stores/authStore';

export const useEventStore = defineStore('event', () => {
  // State
  const events = ref([]);
  const currentEvent = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Pagination state
  const pagination = ref({
    currentPage: 1,
    totalPages: 0,
    perPage: 9,
    total: 0
  });

  // Getters
  const getEventById = computed(() => {
    return (id) => events.value.find(event => event.id === parseInt(id));
  });

  const getActiveEvents = computed(() => {
    return events.value.filter(event => event.is_active);
  });

  // Actions
  const fetchEvents = async (params = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Tambahkan parameter paginasi jika tidak ada
      const paginationParams = {
        page: params.page || pagination.value.currentPage,
        per_page: params.per_page || pagination.value.perPage,
      };

      // Cek status autentikasi menggunakan authStore
      const authStore = useAuthStore();
      let response;

      try {
        if (authStore.isAuthenticated) {
          // Gunakan endpoint yang memerlukan autentikasi
          response = await EventService.getEvents(paginationParams);
        } else {
          // Gunakan endpoint publik jika tidak ada autentikasi
          response = await EventService.getPublicEvents(paginationParams);
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        if (apiError.response) {
          // Jika ada response dari server
          error.value = apiError.response.data?.message || `Error ${apiError.response.status}: ${apiError.response.statusText}`;
        } else if (apiError.request) {
          // Jika request dibuat tapi tidak ada response (network error)
          error.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
        } else {
          // Error lainnya
          error.value = apiError.message || 'Terjadi kesalahan saat mengambil data event';
        }
        throw apiError;
      }

      // Menyesuaikan dengan struktur respons API yang mengembalikan data dalam format collection
      events.value = response.data.data || response.data;

      // Update pagination state jika response memiliki meta pagination
      if (response.data.meta) {
        pagination.value = {
          currentPage: response.data.meta.current_page,
          totalPages: response.data.meta.last_page,
          perPage: response.data.meta.per_page,
          total: response.data.meta.total
        };
      }

      return response;
    } catch (err) {
      error.value = err.message || 'Failed to fetch events';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchEvent = async (id) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await EventService.getEvent(id);
      currentEvent.value = response.data;
      return response;
    } catch (err) {
      if (err.response) {
        // Jika ada response dari server
        error.value = err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        // Jika request dibuat tapi tidak ada response (network error)
        error.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else {
        // Error lainnya
        error.value = err.message || `Gagal mengambil data event dengan id ${id}`;
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createEvent = async (eventData) => {
    isLoading.value = true;
    error.value = null;

    try {
      const formData = new FormData();

      // Add form fields to FormData
      Object.keys(eventData).forEach(key => {
        // Check if it's a file
        if (key === 'poster' || key === 'proposal') {
          if (eventData[key] instanceof File) {
            formData.append(key, eventData[key]);
          }
        } else {
          formData.append(key, eventData[key]);
        }
      });

      const response = await EventService.createEvent(formData);
      events.value.push(response.data);
      return response;
    } catch (err) {
      if (err.response) {
        // Jika ada response dari server
        error.value = err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        // Jika request dibuat tapi tidak ada response (network error)
        error.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else {
        // Error lainnya
        error.value = err.message || 'Gagal membuat event baru';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateEvent = async (id, eventData) => {
    isLoading.value = true;
    error.value = null;

    try {
      const formData = new FormData();

      // Use FormData for multipart/form-data requests (file uploads)
      Object.keys(eventData).forEach(key => {
        // Check if it's a file
        if (key === 'poster' || key === 'proposal') {
          if (eventData[key] instanceof File) {
            formData.append(key, eventData[key]);
          }
        } else {
          formData.append(key, eventData[key]);
        }
      });

      // Append _method field to simulate PUT request
      formData.append('_method', 'PUT');

      const response = await EventService.updateEvent(id, formData);

      // Update the event in the events array
      const index = events.value.findIndex(event => event.id === parseInt(id));
      if (index !== -1) {
        events.value[index] = response.data;
      }

      return response;
    } catch (err) {
      if (err.response) {
        // Jika ada response dari server
        error.value = err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        // Jika request dibuat tapi tidak ada response (network error)
        error.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else {
        // Error lainnya
        error.value = err.message || `Gagal memperbarui event dengan id ${id}`;
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteEvent = async (id) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await EventService.deleteEvent(id);

      // Remove the event from the events array
      events.value = events.value.filter(event => event.id !== parseInt(id));

      return response;
    } catch (err) {
      if (err.response) {
        // Jika ada response dari server
        error.value = err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        // Jika request dibuat tapi tidak ada response (network error)
        error.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else {
        // Error lainnya
        error.value = err.message || `Gagal menghapus event dengan id ${id}`;
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resetState = () => {
    events.value = [];
    currentEvent.value = null;
    isLoading.value = false;
    error.value = null;
    pagination.value = {
      currentPage: 1,
      totalPages: 0,
      perPage: 9,
      total: 0
    };
  };

  const changePage = async (page) => {
    pagination.value.currentPage = page;
    return await fetchEvents({ page });
  };

  return {
    // State
    events,
    currentEvent,
    isLoading,
    error,
    pagination,

    // Getters
    getEventById,
    getActiveEvents,

    // Actions
    fetchEvents,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    resetState,
    changePage
  };
});
