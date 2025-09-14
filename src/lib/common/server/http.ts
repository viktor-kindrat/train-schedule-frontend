import axios, { AxiosHeaders } from 'axios';
import { cookies } from 'next/headers';
import { API_BASE } from '@/constants/common/api';

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

function appendAuthCookie(headers: AxiosHeaders | undefined, cookieValue: string): AxiosHeaders {
  const cookieStr = `auth-token=${encodeURIComponent(cookieValue)}`;
  const ax = headers ?? new AxiosHeaders();
  const prevVal = ax.get('Cookie') ?? ax.get('cookie');
  const prev = prevVal == null ? undefined : String(prevVal);
  ax.set('Cookie', prev ? `${prev}; ${cookieStr}` : cookieStr);
  return ax;
}

axiosPrivateServer.interceptors.request.use(async config => {
  const jar = await cookies();
  const token = jar.get('auth-token')?.value;
  if (token) {
    config.headers = appendAuthCookie(config.headers, token);
  }
  config.withCredentials = true;
  return config;
});

axiosPrivateServerFormData.interceptors.request.use(async config => {
  const jar = await cookies();
  const token = jar.get('auth-token')?.value;
  if (token) {
    config.headers = appendAuthCookie(config.headers, token);
  }
  config.withCredentials = true;
  return config;
});
