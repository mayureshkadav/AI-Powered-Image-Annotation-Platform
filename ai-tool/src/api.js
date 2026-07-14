const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const fromWindow = window.__API_BASE_URL__;
    if (fromWindow) return fromWindow.replace(/\/$/, '');

    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }

  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
