import axios from 'axios';

const API_BASE_URL = '/api';

export const getReports = () => axios.get(`${API_BASE_URL}/reports`).then(response => response.data);

// ... other API calls ...