import apiClient from './api.js';

/**
 * Analyze image for helmet detection and traffic violations
 * @param {FormData} formData - FormData containing the image file
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeImage = async (formData) => {
  return apiClient.post('/predict', formData);
};

/**
 * Fetch analytics data
 * @returns {Promise<Object>} Analytics metrics
 */
export const getAnalytics = async () => {
  return apiClient.get('/analytics');
};

/**
 * Fetch history records with optional filters
 * @param {Object} params - Query parameters (page, limit, sort, filter)
 * @returns {Promise<Object>} History records
 */
export const getHistory = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiClient.get(`/history${queryString ? '?' + queryString : ''}`);
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
  return apiClient.get('/health');
};

/**
 * Get single history record
 * @param {string} id - Record ID
 * @returns {Promise<Object>} History record
 */
export const getHistoryRecord = async (id) => {
  return apiClient.get(`/history/${id}`);
};

/**
 * Delete history record
 * @param {string} id - Record ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteHistoryRecord = async (id) => {
  return apiClient.delete(`/history/${id}`);
};
