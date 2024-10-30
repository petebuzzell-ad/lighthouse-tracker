import axios from 'axios';
import supabase from './supabase';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Customize error message based on status
    if (error.response?.status === 401) {
      throw new Error('Please sign in to continue');
    } else if (error.response?.status === 403) {
      throw new Error('You don\'t have permission to perform this action');
    } else if (error.response?.status === 404) {
      throw new Error('The requested resource was not found');
    } else {
      throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    }
  }
);

export const getReports = async () => {
  try {
    console.log('Fetching reports...');
    const { data } = await api.get('/reports');
    console.log('Reports received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const addUrls = async (urls) => {
  const response = await axios.post(`${API_BASE_URL}/urls`, urls);
  return response.data;
};

export const runLighthouseScan = async (url, device) => {
  const response = await axios.post(`${API_BASE_URL}/scan`, { url, device });
  return response.data;
};

// Add a function to test the database connection
export const testDatabaseConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/test-db`);
    console.log('Database connection test result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Database connection test failed:', error);
    throw error;
  }
};

// ... other API calls ...