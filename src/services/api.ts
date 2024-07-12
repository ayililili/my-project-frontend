import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(response => {
  return response;
}, async error => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise(function(resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/token`, null, { withCredentials: true });
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      processQueue(null, accessToken);
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
});

export default api;
