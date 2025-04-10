import axios from 'axios';

export const KHALTI_CONFIG = {
  baseUrl: 'https://a.khalti.com/api/v2', // Sandbox environment
  secretKey: import.meta.env.VITE_KHALTI_LIVE_SECRET_KEY ?? '',
};

export const khaltiClient = axios.create({
  baseURL: KHALTI_CONFIG.baseUrl,
  headers: {
    Authorization: `Key ${KHALTI_CONFIG.secretKey}`,
    'Content-Type': 'application/json',
  },
});

