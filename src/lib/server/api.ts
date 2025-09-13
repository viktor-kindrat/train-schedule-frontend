export function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true as const,
    path: '/',
    sameSite: (isProd ? 'none' : 'lax') as 'lax' | 'none',
    secure: isProd,
  };
}

export function getReadableCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: false as const,
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
