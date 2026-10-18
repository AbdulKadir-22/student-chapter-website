import api from '../../../shared/api/axios';

// Events stats
export const getEventsStatsApi = async () => {
  const response = await api.get('/events/stats');
  return response.data;
};
export const getEventStatsApi = getEventsStatsApi;

// Events list
export const getEventsApi = async (params = {}) => {
  const response = await api.get('/events', { params });
  return response.data;
};

// Event CRUD
export const createEventApi = async (data) => {
  const response = await api.post('/events', data);
  return response.data;
};

export const updateEventApi = async (id, data) => {
  const response = await api.patch(`/events/${id}`, data);
  return response.data;
};

export const deleteEventApi = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

// Event details & attendees
export const getEventDetailsApi = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};
export const getEventByIdApi = getEventDetailsApi;

export const getEventAttendeesApi = async (id, params = {}) => {
  const response = await api.get(`/events/${id}/attendees`, { params });
  return response.data;
};

export const removeAttendeeApi = async (eventId, userId) => {
  const response = await api.delete(`/events/${eventId}/attendees/${userId}`);
  return response.data;
};

// Scan ticket
export const scanTicketApi = async (eventId, ticketCode) => {
  const response = await api.post(`/events/${eventId}/scan`, { ticketCode });
  return response.data;
};

// Export attendees CSV
export const exportEventAttendeesApi = async (eventId, eventName = 'event') => {
  const response = await api.get(`/events/${eventId}/attendees/export`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  const slug = eventName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  link.setAttribute('download', `${slug || 'event'}-attendees.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const exportAttendeesCsvUrl = (eventId) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${baseUrl}/events/${eventId}/attendees/export`;
};
