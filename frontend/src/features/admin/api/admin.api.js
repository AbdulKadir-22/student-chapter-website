import api from '../../../shared/api/axios';

// Admin Dashboard stats
export const getAdminDashboardApi = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

// Admin Members
export const getAdminMembersApi = async (params = {}) => {
  const response = await api.get('/admin/members', { params });
  return response.data;
};

export const getMemberDetailsApi = async (id) => {
  const response = await api.get(`/admin/members/${id}`);
  return response.data;
};
export const getAdminMemberByIdApi = getMemberDetailsApi;

export const createMemberApi = async (data) => {
  const response = await api.post('/admin/members', data);
  return response.data;
};
export const createAdminMemberApi = createMemberApi;

export const updateMemberApi = async (id, data) => {
  const response = await api.patch(`/admin/members/${id}`, data);
  return response.data;
};
export const updateAdminMemberApi = updateMemberApi;

export const deactivateMemberApi = async (id) => {
  const response = await api.delete(`/admin/members/${id}`);
  return response.data;
};
export const deleteAdminMemberApi = deactivateMemberApi;
