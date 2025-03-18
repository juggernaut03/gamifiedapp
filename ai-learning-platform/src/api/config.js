const API_BASE_URL = 'https://api.yourdomain.com/v1';

export default {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  SUBJECTS: {
    LIST: `${API_BASE_URL}/subjects`,
    DETAILS: (id) => `${API_BASE_URL}/subjects/${id}`,
  },
  CHALLENGES: {
    LIST: `${API_BASE_URL}/challenges`,
    DETAILS: (id) => `${API_BASE_URL}/challenges/${id}`,
  },
  AI_TUTOR: {
    ASK: `${API_BASE_URL}/ai/ask`,
    HISTORY: `${API_BASE_URL}/ai/history`,
  },
  STUDY_PLAN: {
    CREATE: `${API_BASE_URL}/study-plan/create`,
    GET: `${API_BASE_URL}/study-plan`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    SETTINGS: `${API_BASE_URL}/user/settings`,
  },
};
