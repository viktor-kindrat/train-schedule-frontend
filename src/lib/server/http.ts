import axios from 'axios';

export const axiosServer = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  validateStatus: () => true,
});
