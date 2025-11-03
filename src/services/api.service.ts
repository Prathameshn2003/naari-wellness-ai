// API Service Layer for NaariCare
import { API_CONFIG, ENDPOINTS } from '@/config/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Base fetch wrapper with auth
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_CONFIG.BACKEND_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signup: (data: { name: string; email: string; password: string; age: number; location?: string }) =>
    fetchAPI(ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    fetchAPI(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    fetchAPI(ENDPOINTS.AUTH.LOGOUT, { method: 'POST' }),

  getProfile: () =>
    fetchAPI(ENDPOINTS.AUTH.ME),

  updateProfile: (data: any) =>
    fetchAPI(ENDPOINTS.AUTH.ME, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Tracker API
export const trackerAPI = {
  getCalendar: (startDate: string, endDate: string) =>
    fetchAPI(`${ENDPOINTS.TRACKER.CALENDAR}?start=${startDate}&end=${endDate}`),

  createEntry: (data: {
    date: string;
    symptoms: any;
    attachments?: any;
  }) =>
    fetchAPI(ENDPOINTS.TRACKER.ENTRY, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEntry: (id: string, data: any) =>
    fetchAPI(`${ENDPOINTS.TRACKER.ENTRY}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteEntry: (id: string) =>
    fetchAPI(`${ENDPOINTS.TRACKER.ENTRY}/${id}`, {
      method: 'DELETE',
    }),
};

// Prediction API
export const predictionAPI = {
  predictPCOS: (features: any) =>
    fetchAPI(ENDPOINTS.PREDICT.PCOS, {
      method: 'POST',
      body: JSON.stringify({ features }),
    }),

  predictMenopause: (features: any) =>
    fetchAPI(ENDPOINTS.PREDICT.MENOPAUSE, {
      method: 'POST',
      body: JSON.stringify({ features }),
    }),
};

// Recommendation API
export const recommendationAPI = {
  getDiet: (profile: any) =>
    fetchAPI(ENDPOINTS.RECOMMEND.DIET, {
      method: 'POST',
      body: JSON.stringify({ profile }),
    }),

  getExercise: (profile: any) =>
    fetchAPI(ENDPOINTS.RECOMMEND.EXERCISE, {
      method: 'POST',
      body: JSON.stringify({ profile }),
    }),
};

// Resources API
export const resourcesAPI = {
  getResources: (category?: string, query?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('q', query);
    return fetchAPI(`${ENDPOINTS.RESOURCES}?${params.toString()}`);
  },
};

// Doctors API
export const doctorsAPI = {
  getDoctors: (lat?: number, lng?: number, query?: string) => {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat.toString());
    if (lng) params.append('lng', lng.toString());
    if (query) params.append('q', query);
    return fetchAPI(`${ENDPOINTS.DOCTORS}?${params.toString()}`);
  },
};

// Chat API
export const chatAPI = {
  sendMessage: (message: string) =>
    fetchAPI(ENDPOINTS.CHAT, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () =>
    fetchAPI(ENDPOINTS.NOTIFICATIONS),

  scheduleNotification: (data: any) =>
    fetchAPI(`${ENDPOINTS.NOTIFICATIONS}/schedule`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  acknowledgeNotification: (id: string) =>
    fetchAPI(`${ENDPOINTS.NOTIFICATIONS}/${id}/ack`, {
      method: 'PUT',
    }),
};
