// مدیریت متمرکز token ها

export function saveTokens(accessToken: string, tokenType: string = 'Bearer', refreshToken?: string) {
  if (typeof window === 'undefined') return;

  // ذخیره در localStorage
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('token_type', tokenType);

  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }

  // ذخیره در cookie برای middleware
  document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

}

export function clearTokens() {
  if (typeof window === 'undefined') return;

  // پاک کردن از localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_type');

  // پاک کردن cookie
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function hasToken(): boolean {
  return !!getToken();
}

export function getUserIdFromToken(): string | null {
  const token = getToken();
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload.user_id || payload.sub || payload.id || null;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}