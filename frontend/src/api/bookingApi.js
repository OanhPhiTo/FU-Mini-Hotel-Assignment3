import axiosClient from './axiosClient';

export const bookingApi = {
  create: (data) => axiosClient.post('/bookings', data),
  getAll: (params) => axiosClient.get('/bookings', { params }),
  getMyBookings: (params) => axiosClient.get('/bookings/my-bookings', { params }),
  getById: (id) => axiosClient.get(`/bookings/${id}`),
  updateStatus: (id, bookingStatus) => axiosClient.put(`/bookings/${id}/status`, { bookingStatus }),
};

export default bookingApi;

