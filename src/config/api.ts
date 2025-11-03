// API Configuration for NaariCare
// Frontend connects to your external Spring Boot backend

export const API_CONFIG = {
  // Backend API Base URL (your Spring Boot server)
  BACKEND_BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api',
  
  // Third-party APIs (optional, if not using backend proxy)
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  NEWS_API_KEY: import.meta.env.VITE_NEWS_API_KEY || '',
};

// API Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/users/me',
  },
  // Tracking
  TRACKER: {
    CALENDAR: '/tracker/calendar',
    ENTRY: '/tracker/entry',
  },
  // Predictions
  PREDICT: {
    PCOS: '/predict/pcos',
    MENOPAUSE: '/predict/menopause',
  },
  // Recommendations
  RECOMMEND: {
    DIET: '/recommend/diet',
    EXERCISE: '/recommend/exercise',
  },
  // Resources
  RESOURCES: '/resources',
  DOCTORS: '/doctors',
  SCHEMES: '/schemes',
  // Chat
  CHAT: '/chat/message',
  // Notifications
  NOTIFICATIONS: '/notifications',
};

export const isAPIConfigured = (service: keyof typeof API_CONFIG) => {
  return !!API_CONFIG[service];
};
