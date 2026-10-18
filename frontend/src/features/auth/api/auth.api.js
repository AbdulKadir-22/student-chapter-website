import api from '../../../shared/api/axios';

/**
 * Perform login request
 * @param {Object} credentials - { email, password, remember }
 * @returns {Promise<Object>}
 */
export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Logout request
 * @returns {Promise<Object>}
 */
export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * Fetch authenticated user profile
 * @returns {Promise<Object>}
 */
export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Change password
 * @param {Object} payload - { currentPassword, newPassword }
 * @returns {Promise<Object>}
 */
export const changePasswordApi = async (payload) => {
  const response = await api.patch('/auth/change-password', payload);
  return response.data;
};
