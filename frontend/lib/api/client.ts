const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  bodyData?: any;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function attemptTokenRefresh(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(!!token);
      });
    });
  }

  isRefreshing = true;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      throw new Error('Refresh expired');
    }

    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    onRefreshed(data.accessToken);
    return true;
  } catch (err) {
    onRefreshed('');
    return false;
  } finally {
    isRefreshing = false;
  }
}

function handleLogoutRedirect() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}

export async function apiFetch(path: string, options: RequestOptions = {}): Promise<Response> {
  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.bodyData !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.bodyData !== undefined) {
    config.body = JSON.stringify(options.bodyData);
  }

  let response = await fetch(url, config);

  if (response.status === 401) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed && typeof window !== 'undefined') {
      const newAccessToken = localStorage.getItem('accessToken');
      if (newAccessToken) {
        headers.set('Authorization', `Bearer ${newAccessToken}`);
        config.headers = headers;
        response = await fetch(url, config);
      }
    } else {
      handleLogoutRedirect();
    }
  }

  return response;
}

export const api = {
  async get(path: string, options?: RequestOptions) {
    return apiFetch(path, { ...options, method: 'GET' });
  },
  async post(path: string, body?: any, options?: RequestOptions) {
    return apiFetch(path, { ...options, method: 'POST', bodyData: body });
  },
  async put(path: string, body?: any, options?: RequestOptions) {
    return apiFetch(path, { ...options, method: 'PUT', bodyData: body });
  },
  async patch(path: string, body?: any, options?: RequestOptions) {
    return apiFetch(path, { ...options, method: 'PATCH', bodyData: body });
  },
  async delete(path: string, options?: RequestOptions) {
    return apiFetch(path, { ...options, method: 'DELETE' });
  },
};
