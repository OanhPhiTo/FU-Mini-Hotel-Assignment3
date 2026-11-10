import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  register: (data) => axiosClient.post('/auth/register', data),
  getCurrentUser: () => axiosClient.get('/auth/me'),
};

export default authApi;

