// API Configuration
// Add your API keys here or use environment variables

export const API_CONFIG = {
  // OpenAI for ChatPage
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  OPENAI_BASE_URL: 'https://api.openai.com/v1',
  
  // Google Maps for Gynecologists
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  
  // News API for Resources
  NEWS_API_KEY: import.meta.env.VITE_NEWS_API_KEY || '',
  NEWS_API_BASE_URL: 'https://newsapi.org/v2',
  
  // Content API for Schemes (can use same as news or different)
  SCHEMES_API_KEY: import.meta.env.VITE_SCHEMES_API_KEY || '',
};

export const isAPIConfigured = (service: keyof typeof API_CONFIG) => {
  return !!API_CONFIG[service];
};
