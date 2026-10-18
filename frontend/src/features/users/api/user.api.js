import api from '../../../shared/api/axios';

/**
 * Get featured office bearers
 */
export const getFeaturedUsersApi = async () => {
  const response = await api.get('/users/featured');
  return response.data;
};

/**
 * Get directory filters
 */
export const getFiltersApi = async () => {
  const response = await api.get('/users/filters');
  return response.data;
};

/**
 * Get member directory
 * @param {Object} params - { q, role, year, department, sort, page, limit }
 */
export const getDirectoryApi = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

/**
 * Get own profile
 */
export const getMyProfileApi = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

/**
 * Update own profile
 * @param {Object} payload - { shortBio, about, skills, quote, socials }
 */
export const updateMyProfileApi = async (payload) => {
  const response = await api.patch('/users/me', payload);
  return response.data;
};

/**
 * Get public member profile by ID
 * @param {string} id
 */
export const getMemberProfileApi = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/**
 * Get user ticket QR payload
 */
export const getMyTicketApi = async () => {
  const response = await api.get('/users/me/ticket');
  return response.data;
};

/**
 * Get user event history (attended)
 * @param {string} id
 * @param {Object} params - { page, limit }
 */
export const getUserEventsApi = async (id, params = {}) => {
  const response = await api.get(`/users/${id}/events`, { params });
  return response.data;
};

/**
 * Get user coordinator roles
 * @param {string} id
 * @param {Object} params - { page, limit }
 */
export const getUserCoordinatorRolesApi = async (id, params = {}) => {
  const response = await api.get(`/users/${id}/coordinator-roles`, { params });
  return response.data;
};
