import axios from 'axios';
import { auth } from '@/lib/firebase'; // Assuming your client-side firebase auth is exported here

const YOUR_SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:3000'; // Use environment variable or default
const YOUR_SERVER_BASE_URL_WITH_API = process.env.CLOUD_WORKSTATIONS
  ? `https://3001-${window.location.hostname}/api`
  : process.env.NEXT_PUBLIC_SERVER_BASE_URL_WITH_API || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: YOUR_SERVER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the ID token to all requests
apiClient.interceptors.request.use(async (config) => {config.baseURL = YOUR_SERVER_BASE_URL_WITH_API
  const user = auth.currentUser;
  if (user) {
    try {
      const idToken = await user.getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`;
    } catch (error) {
      console.error('Error getting Firebase ID token:', error);
      // Optionally handle token acquisition errors, e.g., redirect to login
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;