import axios from 'axios';

const API_BASE_URL = '/api';

export const getReports = async () => {
  try {
    console.log('Fetching reports...');
    const response = await axios.get(`${API_BASE_URL}/reports`);
    console.log('Reports received:', response.data);
    return response.data;
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