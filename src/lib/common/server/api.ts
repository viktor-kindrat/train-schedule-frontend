type CookieOptions = {
  httpOnly: boolean;
  path: string;
  sameSite: 'lax' | 'none';
  secure: boolean;
};

export function getCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSite: 'lax' | 'none' = isProd ? 'none' : 'lax';
  return {
    httpOnly: true,
    path: '/',
    sameSite,
    secure: isProd,
  };
}

export function getReadableCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSite: 'lax' | 'none' = isProd ? 'none' : 'lax';
  return {
    httpOnly: false,
    path: '/',
    sameSite,
    secure: isProd,
  };
}

export function getAuthTokenFromSetCookie(
  setCookieHeader: string | string[] | null
): string | null {
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
