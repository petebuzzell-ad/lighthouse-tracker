import axios from 'axios';

const API_BASE_URL = '/api';

export const getReports = () => axios.get(`${API_BASE_URL}/reports`).then(response => response.data);

export const addUrls = async (urls) => {
  const response = await axios.post(`${API_BASE_URL}/urls`, urls);
  return response.data;
};

export const runLighthouseScan = async (url, device) => {
  const response = await axios.post(`${API_BASE_URL}/scan`, { url, device });
  return response.data;
};

// ... other API calls ...