import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
});

export const getReports = async () => {
    try {
        const response = await api.get('/api/reports');
        console.log('Reports fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
};

export const addUrls = async (urls) => {
    try {
        console.log('Sending URLs to backend:', urls);
        const response = await api.post('/api/urls', { urls });
        console.log('Response from backend:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding URLs:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const runLighthouseScan = async (url, device) => {
    try {
        const response = await api.post('/api/run-lighthouse', { url, device });
        console.log('Lighthouse scan initiated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error initiating Lighthouse scan:', error.response ? error.response.data : error.message);
        throw error;
    }
};