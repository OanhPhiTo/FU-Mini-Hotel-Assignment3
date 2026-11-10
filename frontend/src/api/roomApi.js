import axiosClient from './axiosClient';

export const roomApi = {
  getAll: (params) => axiosClient.get('/rooms', { params }),
  search: (params) => axiosClient.get('/rooms/search', { params }),
  getById: (id) => axiosClient.get(`/rooms/${id}`),
  create: (data) => axiosClient.post('/rooms', data),
  update: (id, data) => axiosClient.put(`/rooms/${id}`, data),
  delete: (id) => axiosClient.delete(`/rooms/${id}`),
  getRoomTypes: () => axiosClient.get('/room-types'),
  createRoomType: (data) => axiosClient.post('/room-types', data),
};

export default roomApi;

