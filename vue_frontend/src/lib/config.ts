export const HOST_API =
  import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8000/api';

export const REDIRECT_FALLBACK = '/dashboard/profile' as const;
