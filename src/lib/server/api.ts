import { cookies } from 'next/headers';
import { API_BASE } from '@/lib/constants/api';
import { axiosServer } from '@/lib/server/http';

export function getApiUrl(path: string) {
  if (!path.startsWith('/')) path = `/${path}`;
  return `${API_BASE}${path}`;
}

export function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true as const,
    path: '/',
    sameSite: (isProd ? 'none' : 'lax') as 'lax' | 'none',
    secure: isProd,
  };
}

export function getAuthTokenFromSetCookie(setCookieHeader: string | string[] | null): string | null {
  if (!setCookieHeader) return null;
  const lines = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  for (const line of lines) {
    const match = /(?:^|;\s*)auth-token=([^;]+)/i.exec(line);
    if (match) {
      return decodeURIComponent(match[1]);
    }
  }
  return null;
}

export type ApiFetchInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

function normalizeHeaders(input?: HeadersInit): Record<string, string> {
  if (!input) return {};
  if (input instanceof Headers) {
    const normalized: Record<string, string> = {};
    input.forEach((value, key) => {
      normalized[key] = value;
    });
    return normalized;
  }
  if (Array.isArray(input)) {
    const normalized: Record<string, string> = {};
    for (const [key, value] of input) normalized[key] = value;
    return normalized;
  }
  return { ...(input as Record<string, string>) };
}

class ResponseShim {
  status: number;
  statusText: string;
  ok: boolean;
  private _data: unknown;
  private _headers: Record<string, string | string[] | undefined>;
  headers: { get: (name: string) => string | null };

  constructor(
    status: number,
    statusText: string,
    headers: Record<string, string | string[] | undefined>,
    data: unknown,
  ) {
    this.status = status;
    this.statusText = statusText;
    this.ok = status >= 200 && status < 300;
    this._headers = headers;
    this._data = data;
    this.headers = {
      get: (name: string) => {
        const v = this._headers[name.toLowerCase()];
        if (Array.isArray(v)) return v.join(', ');
        return typeof v === 'string' ? v : null;
      },
    };
  }

  async json(): Promise<unknown> {
    if (typeof this._data === 'string') {
      try {
        return JSON.parse(this._data);
      } catch {
        return this._data;
      }
    }
    return this._data;
  }

  async text(): Promise<string> {
    if (typeof this._data === 'string') return this._data;
    try {
      return JSON.stringify(this._data);
    } catch {
      return String(this._data);
    }
  }
}

export async function apiFetch(input: string, init?: ApiFetchInit): Promise<Response> {
  const url = input.startsWith('http') ? input : getApiUrl(input);
  const jar = await cookies();
  const token = jar.get('auth-token')?.value;

  const baseHeaders = normalizeHeaders(init?.headers);
  if (init?.body && !Object.keys(baseHeaders).some((k) => k.toLowerCase() === 'content-type')) {
    baseHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    const existingCookie = Object.entries(baseHeaders).find(([k]) => k.toLowerCase() === 'cookie')?.[1];
    const cookieStr = `auth-token=${encodeURIComponent(token)}`;
    baseHeaders['Cookie'] = existingCookie ? `${existingCookie}; ${cookieStr}` : cookieStr;
  }

  const resp = await axiosServer.request({
    url,
    method: (init?.method as any) || 'GET',
    headers: baseHeaders,
    data: init?.body as any,
    withCredentials: true,
    responseType: 'text',
  });

  const shim = new ResponseShim(resp.status, resp.statusText, resp.headers as Record<string, string | string[]>, resp.data);
  return (shim as unknown) as Response;
}
