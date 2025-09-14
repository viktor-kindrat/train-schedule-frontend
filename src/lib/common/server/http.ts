import axios, { AxiosHeaders, type AxiosRequestHeaders } from 'axios';
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

function appendAuthCookie(
  headers: AxiosRequestHeaders | AxiosHeaders | undefined,
  cookieValue: string
): AxiosRequestHeaders | AxiosHeaders {
  const cookieStr = `auth-token=${encodeURIComponent(cookieValue)}`;
  if (headers instanceof AxiosHeaders) {
    const prev = headers.get('Cookie') ?? headers.get('cookie') ?? undefined;
    headers.set('Cookie', prev ? `${prev}; ${cookieStr}` : cookieStr);
    return headers;
  }
  const result: Record<string, string> = {};
  if (headers) {
    for (const [key, val] of Object.entries(headers)) {
      result[key] = String(val);
    }
  }
  const prev = result.Cookie ?? result.cookie;
  result.Cookie = prev ? `${prev}; ${cookieStr}` : cookieStr;
  return result as unknown as AxiosRequestHeaders;
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
