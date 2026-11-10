import axiosClient from './axiosClient';

export const customerApi = {
  getAll: (params) => axiosClient.get('/customers', { params }),
  search: (params) => axiosClient.get('/customers/search', { params }),
  getById: (id) => axiosClient.get(`/customers/${id}`),
  create: (data) => axiosClient.post('/customers', data),
  update: (id, data) => axiosClient.put(`/customers/${id}`, data),
  delete: (id) => axiosClient.delete(`/customers/${id}`),
  getMyProfile: () => axiosClient.get('/customers/profile/me'),
  updateMyProfile: (data) => axiosClient.put('/customers/profile/me', data),
};

export default customerApi;

