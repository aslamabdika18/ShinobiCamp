import { apiClient, publicApiClient } from './axiosConfig';


const EventService = {
  /**
   * Get all events with optional pagination (requires authentication)
   * @param {Object} params - Query parameters
   * @returns {Promise} - Axios response
   */
  getEvents(params = {}) {
    return apiClient.get('/events', { params });
  },

  /**
   * Get all events from public endpoint (no authentication required)
   * @param {Object} params - Query parameters
   * @returns {Promise} - Axios response
   */
  getPublicEvents(params = {}) {
    return publicApiClient.get('/public/events', { params });
  },

  /**
   * Get a single event by ID
   * @param {number|string} id - Event ID
   * @returns {Promise} - Axios response
   */
  getEvent(id) {
    return apiClient.get(`/events/${id}`);
  },

  /**
   * Create a new event
   * @param {FormData} eventData - Event data as FormData
   * @returns {Promise} - Axios response
   */
  createEvent(eventData) {
    // Set proper content type for FormData
    const headers = { 'Content-Type': 'multipart/form-data' };
    return apiClient.post('/events', eventData, { headers });
  },

  /**
   * Update an existing event
   * @param {number|string} id - Event ID
   * @param {FormData} eventData - Event data as FormData
   * @returns {Promise} - Axios response
   */
  updateEvent(id, eventData) {
    // Set proper content type for FormData
    const headers = { 'Content-Type': 'multipart/form-data' };
    return apiClient.post(`/events/${id}`, eventData, { headers });
  },

  /**
   * Delete an event
   * @param {number|string} id - Event ID
   * @returns {Promise} - Axios response
   */
  deleteEvent(id) {
    return apiClient.delete(`/events/${id}`);
  }
};

export default EventService;
