import axios from 'axios';
import { cookies } from 'next/headers';
import { API_BASE } from '@/constants/api';

const baseURL = API_BASE && API_BASE.startsWith('http') ? API_BASE : undefined;

export const axiosServer = axios.create({
  baseURL,
  withCredentials: true,
  validateStatus: () => true,
});

export const axiosPublicServer = axios.create({
  baseURL,
  withCredentials: true,
  validateStatus: () => true,
  headers: { 'Content-Type': 'application/json' },
});

export const axiosPrivateServer = axios.create({
  baseURL,
  withCredentials: true,
  validateStatus: () => true,
  headers: { 'Content-Type': 'application/json' },
});

export const axiosPrivateServerFormData = axios.create({
  baseURL,
  withCredentials: true,
  validateStatus: () => true,
  headers: { 'Content-Type': 'multipart/form-data' },
});

axiosPrivateServer.interceptors.request.use(async (config) => {
  const jar = await cookies();
  const token = jar.get('auth-token')?.value;
  if (token) {
    const prevCookie = (config.headers as any)?.['Cookie'] || (config.headers as any)?.['cookie'];
    const cookieStr = `auth-token=${encodeURIComponent(token)}`;
    config.headers = {
      ...(config.headers || {}),
      Cookie: prevCookie ? `${prevCookie}; ${cookieStr}` : cookieStr,
    } as any;
  }
  config.withCredentials = true;
  return config;
});

axiosPrivateServerFormData.interceptors.request.use(async (config) => {
  const jar = await cookies();
  const token = jar.get('auth-token')?.value;
  if (token) {
    const prevCookie = (config.headers as any)?.['Cookie'] || (config.headers as any)?.['cookie'];
    const cookieStr = `auth-token=${encodeURIComponent(token)}`;
    config.headers = {
      ...(config.headers || {}),
      Cookie: prevCookie ? `${prevCookie}; ${cookieStr}` : cookieStr,
    } as any;
  }
  config.withCredentials = true;
  return config;
});
