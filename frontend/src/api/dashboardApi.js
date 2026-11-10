import axiosClient from './axiosClient';

export const dashboardApi = {
  getStats: () => axiosClient.get('/admin/dashboard'),
};

export default dashboardApi;

